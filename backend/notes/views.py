from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Note
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from rest_framework import viewsets
from .models import Note
from .serializers import NoteSerializer

# Download required NLTK data
nltk.download('punkt')
nltk.download('stopwords')

class NoteViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows notes to be viewed or edited.
    """
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    
    def get_queryset(self):
        queryset = Note.objects.all()
        # Add simple search functionality
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(title__icontains=search) | queryset.filter(content__icontains=search)
        return queryset    

@api_view(['GET'])
def get_connected_notes(request, note_id):
    try:
        # Get the source note
        source_note = Note.objects.get(id=note_id)
        
        # Get all other notes
        other_notes = Note.objects.exclude(id=note_id)
        
        if len(other_notes) == 0:
            return Response({"connections": []})
        
        # Prepare text for similarity analysis
        all_notes = list(other_notes) + [source_note]
        note_contents = [note.content for note in all_notes]
        
        # Calculate TF-IDF vectors
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform(note_contents)
        
        # Calculate cosine similarity
        cosine_similarities = cosine_similarity(tfidf_matrix[-1], tfidf_matrix[:-1]).flatten()
        
        # Get the top 5 most similar notes
        similar_indices = cosine_similarities.argsort()[-5:][::-1]
        
        connections = []
        for idx in similar_indices:
            if cosine_similarities[idx] > 0.1:  # Only include if similarity is meaningful
                connections.append({
                    "id": other_notes[idx].id,
                    "title": other_notes[idx].title,
                    "similarity": float(cosine_similarities[idx])
                })
        
        return Response({"connections": connections})
        
    except Note.DoesNotExist:
        return Response({"error": "Note not found"}, status=404)

