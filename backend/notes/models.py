from django.db import models

class Note(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    tags = models.CharField(max_length=200, blank=True)  # Simple comma-separated tags
    
    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        return self.title