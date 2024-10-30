from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from .models import Media
import json


# Create your views here.

def index(request):
    media_objects = Media.objects.all()

    context = {
        'media_objects': media_objects
    }

    return render(request, "Media_Site/index.html", context)

def movies(request):
    media_objects = Media.objects.all()

    context = {
        'media_objects': media_objects
    }

    return render(request, "Media_Site/movies.html", context)

def shows(request):
    media_objects = Media.objects.all()

    context = {
        'media_objects': media_objects
    }

    return render(request, "Media_Site/tv-series.html", context)

def bookmarked(request):
    media_objects = Media.objects.all()

    context = {
        'media_objects': media_objects
    }

    return render(request, "Media_Site/bookmarked.html", context)

def login(request):
    return render(request, "Media_Site/login.html")

def signup(request):
    return render(request, "Media_Site/sign-up.html")

def api(request):
    # Get all the media objects
    media_objects = Media.objects.all()
    # create a list of dictionaries (like the json used to look)
    media_objects_as_dicts = [x.to_json() for x in media_objects]
    # return as JSON
    # Look into how to return JSON
    return JsonResponse(media_objects_as_dicts, safe=False)

def toggle_bookmark(request, media_id):
    
    try:
        media = Media.objects.get(id=media_id)
        media.isBookmarked = not media.isBookmarked
        media.save()
        return JsonResponse({'success': True, 'isBookmarked': media.isBookmarked})
    except Media.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Media Not Found.'})
