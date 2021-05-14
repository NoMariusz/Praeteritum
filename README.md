# Praeteritum

**Web browser multiplayer strategy card game**

Online game combining original battle strategy games with fast-paced card games in turn-based form

![Match UI](https://user-images.githubusercontent.com/60425872/109867369-b0d21b00-7c66-11eb-8637-49fd04a0ff60.jpg)

### See the project in action 👉 [https://praeteritum.herokuapp.com](https://praeteritum.herokuapp.com)

> ⚠️ Project is in very early stage of development

## Features

- **Match**: you can combat against other player by your cards to capture his base or destroy his units and gain glory
- **Cards**: each card describe unit with different properties like: rarity, category, health points
- **Units relations**: every unit is unique in some way, units categories affect in different way on each other
- **Strategy**: arrangement of your units in board is important to win
- **Accounts**: to information about your deck, collection etc. was safely stored

## Built with

* [Django](https://github.com/django/django)
* [Django REST framework](https://github.com/encode/django-rest-framework)
* [Django Channels](https://github.com/django/channels)
* [React](https://github.com/facebook/react)
* [Material-UI](https://github.com/mui-org/material-ui)

## Installation

Praeteritum requires Python 3.9.1, pip >= 20.2.3 and Redis >= 5.0
> ⚠️ Redis service should be active to django-channels can run correctly

Clone repository from github
```
git clone https://github.com/NoMariusz/Praeteritum.git
```

After that if you want, make venv for packages and install dependencies by pip install
```
pip install -r requirements.txt
```

It will be good to make now .env file with all necessary environment variables
```
echo > .env
```

Now run migrate to django create database
```
py manage.py migrate
```

And before run, it is good to have some admin account, so make it
```
python manage.py createsuperuser
```

Finally you can run server
```
py manage.py runserver 127.0.0.1:80
```

> Hint! If you want to play a match, don't forgot add some cards from admin page

## Contributing

Praeteritum code should be viewed and edited with your editor set to use four spaces per tab.
In Python part of code please follow [PEP 8](https://www.python.org/dev/peps/pep-0008/).
JavaScript / React part is written mostly at function components and tries to follow [Airbnb React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react).
> Images are mostly from [Pixabay](pixabay.com)

### Testing

Application uses [pytest](pytest.org) with [pytest-asyncio](https://pypi.org/project/pytest-asyncio) and [pytest-django](https://pypi.org/project/pytest-django/).
That combination help a lot to test asyncronous code and threads which needs to access django ORM.

## License

Project is made available under the terms of the [MIT license](https://github.com/NoMariusz/Praeteritum/blob/main/LICENSE)

#### Made by [NoMariusz](https://github.com/NoMariusz)

nomariusz27@gmail.com
