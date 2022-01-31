test:
	echo "Test"
	python manage.py test
	cd ui; npm test

build:
	echo "Build"
	cd ui; npm run build
	python manage.py collectstatic --noinput --clear