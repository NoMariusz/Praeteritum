class Delegator():
    """ Class implementing Delegator pattern in childrens, who enable to
    automaticaly use functions and methods from _delegate_subsystems, so
    reduces boilerplate code
    !!! be aware that Delegator can't delegate methods from childrens
    which implements Delegator
    """

    def __init__(self):
        # prepare list of instances to delegate work to them
        if not self._delegate_subsystems:
            self._delegate_subsystems: list[object] = []

        # prepare dict with subsystems and their methods
        self._subsystems_dicts = [
            {
                "subsystem": s,
                "methods": [
                    f for f in dir(s) if not f.startswith('_')
                ]
            }
            for s in self._delegate_subsystems
        ]

    def __getattr__(self, func):
        """ Enable to delegate all methods from subsystems to self """

        def method(*args):
            # get list of subsystems with specified method
            results = list(filter(
                lambda subsystem_data: func in subsystem_data["methods"],
                self._subsystems_dicts))
            # if some results, return that function to execute
            if len(results) > 0:
                return getattr(results[0]["subsystem"], func)(*args)
            else:
                # raise error if not found
                raise AttributeError
        return method
