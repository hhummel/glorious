build:
	echo "Build"
	cd ui; npm run build
	python manage.py collectstatic --noinput --clear