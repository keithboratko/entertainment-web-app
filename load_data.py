import os
import django
import sys

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'MediaSite.settings')
django.setup()

from Media_Site import models

# How can I clear the Media table?
# like this...

models.Media.objects.all().delete()

# load the json data
import json
import pprint
from pathlib import Path


with Path("data.json").open() as f:
    data = json.load(f)

for media_item in data:
    media_item['thumbnail'] = media_item['thumbnail']['regular']['large'].replace("regular/large.jpg", "")[2:]
    models.Media(**media_item).save()
