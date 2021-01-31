from asgiref.sync import sync_to_async


def run_as_async(sync_fun, *args, **kwargs):
    return sync_to_async(lambda: sync_fun(*args, **kwargs))()
