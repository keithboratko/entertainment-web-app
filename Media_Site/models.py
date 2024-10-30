from django.db import models

# Create your models here.

class Media(models.Model):
    title = models.CharField(max_length=64)
    year = models.IntegerField()
    category = models.CharField(max_length=24)
    rating = models.CharField(max_length=8)
    isBookmarked = models.BooleanField()
    isTrending = models.BooleanField()
    thumbnail = models.CharField(max_length=128)
    # thumbnail = {
    #     'trending': {
    #         'small': models.CharField(max_length=64),
    #         'large': models.CharField(max_length=64)
    #     },
    #     'regular': {
    #         'small': models.CharField(max_length=64),
    #         'medium': models.CharField(max_length=64),
    #         'large': models.CharField(max_length=64)
    #  
    #    }
    # }

    def to_json(self):
        return {
            'id': self.id,
            'title': self.title,
            'year': self.year,
            'category': self.category,
            'rating': self.rating,
            'isBookmarked': self.isBookmarked,
            'isTrending': self.isTrending,
            'thumbnail': self.thumbnail
        }