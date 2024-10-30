from django.urls import path
from . import views

urlpatterns = [
    path("home", views.index, name="index"),
    path("movies", views.movies, name="movies"),
    path("tv-series", views.shows, name="tv-series"),
    path("bookmarked", views.bookmarked, name="bookmarked"),
    path("login", views.login, name="login"),
    path("sign-up", views.signup, name="sign-up"),
    path("api-data/", views.api, name="api"),
    path("api-data/<int:media_id>/toggle-bookmark/", views.toggle_bookmark, name="toggle_bookmark")
]