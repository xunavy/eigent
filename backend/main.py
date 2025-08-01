import os
import pathlib
import signal
import asyncio
import atexit
from app import api
from loguru import logger
from app.component.environment import auto_include_routers, env


os.environ["PYTHONIOENCODING"] = "utf-8"

prefix = env("url_prefix", "")
auto_include_routers(api, prefix, "app/controller")


# Configure Loguru
logger.add(
    os.path.expanduser("~/.eigent/runtime/log/app.log"),  # Log file
    rotation="10 MB",  # Log rotation: 10MB per file
    retention="10 days",  # Retain logs for the last 10 days
    level="DEBUG",  # Log level
    encoding="utf-8",
)

dir = pathlib.Path(__file__).parent / "runtime"
dir.mkdir(parents=True, exist_ok=True)


# Write PID file asynchronously
async def write_pid_file():
    r"""Write PID file asynchronously"""
    import aiofiles

    async with aiofiles.open(dir / "run.pid", "w") as f:
        await f.write(str(os.getpid()))


# Create task to write PID
asyncio.create_task(write_pid_file())

# Graceful shutdown handler
shutdown_event = asyncio.Event()


async def cleanup_resources():
    r"""Cleanup all resources on shutdown"""
    logger.info("Starting graceful shutdown...")

    from app.service.task import task_locks, _cleanup_task

    if _cleanup_task and not _cleanup_task.done():
        _cleanup_task.cancel()
        try:
            await _cleanup_task
        except asyncio.CancelledError:
            pass

    # Cleanup all task locks
    for task_id in list(task_locks.keys()):
        try:
            task_lock = task_locks[task_id]
            await task_lock.cleanup()
        except Exception as e:
            logger.error(f"Error cleaning up task {task_id}: {e}")

    # Remove PID file
    pid_file = dir / "run.pid"
    if pid_file.exists():
        pid_file.unlink()

    logger.info("Graceful shutdown completed")


def signal_handler(signum, frame):
    r"""Handle shutdown signals"""
    logger.info(f"Received signal {signum}")
    asyncio.create_task(cleanup_resources())
    shutdown_event.set()


signal.signal(signal.SIGTERM, signal_handler)
signal.signal(signal.SIGINT, signal_handler)

atexit.register(lambda: asyncio.run(cleanup_resources()))
