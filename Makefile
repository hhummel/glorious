test:
	echo "Test"
	python manage.py test bread.tests
	cd ui; npm test

build:
	echo "Build"
	cd ui; npm run build
	python manage.py collectstatic --noinput --clear