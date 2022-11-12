# Version Requirements
<img src="https://img.shields.io/badge/python-3.11.0-green?style=for-the-badge">   <img src="https://img.shields.io/badge/Django-4.1.3-blue?style=for-the-badge">


# Local Development Steps

1. Python 3.11.0 virtual environment
```shell
python -m venv venv
```
2. Install required dependencies.
```shell
pip install -r requirements.txt
```
3. Create local postgres database named nitar-ott.
4. Start the dev server
```shell
python manage.py runserver
```

# Local Development Steps (in frontend folder)

1. Install Node v8.19.2

2. Install Yarn

```shell
npm i -g yarn
```

3. Install Dependencies

```shell
yarn install
```

4. Start Development Server

```shell
yarn run dev
```

5. Production Build (dist) folder

```shell
yarn run build
```
