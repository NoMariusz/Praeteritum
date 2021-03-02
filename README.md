# Praeteritum

**Web browser multiplayer strategy card game**

Online game combining original battle strategy games with fast-paced card games in turn-based form

## Features

- **Match**: you can combat against other player by your cards to capture his base or destroy his units and gain glory
- **Cards**: each card describe unit with different properties like: rarity, category, health points
- **Units relations**: every unit is unique in some way, units categories affect in different way on each other
- **Strategy**: arrangement of your units in board is important to win
- **Accounts**: to information about your deck, collection etc. was safely stored

## Installation

Praeteritum requires Python 3.9.1, pip >= 20.2.3 and Redis >= 5.0
###### Note! Redis service should be active to django-channels run correctly

Clone repository from github
```
git clone https://github.com/NoMariusz/Praeteritum.git
```

After that if you want, make venv for packages and install dependencies by pip install
```
pip install -r requirements.txt
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

###### Hint! If you want to play a match, not forgot add some cards from admin page

## Contributing

Praeteritum code should be viewed and edited with your editor set to use four spaces per tab.
In Python part of code please follow [PEP 8](https://www.python.org/dev/peps/pep-0008/).
JavaScript / React part is written mostly at function components and tries to follow [Airbnb React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react).
##### Images are mostly from [Pixabay](pixabay.com)

## License

Project is made available under the terms of the [MIT license](https://github.com/NoMariusz/Praeteritum/blob/main/LICENSE)

#### Made by [NoMariusz](https://github.com/NoMariusz)

nomariusz27@gmail.com
