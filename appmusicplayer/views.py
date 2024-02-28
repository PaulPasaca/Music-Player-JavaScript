from django.http import HttpResponse
from django.template import loader
# Create your views here.
def testing(request):
  template = loader.get_template('inicio.html')
  context = {
    'fruits': ['Apple', 'Banana', 'Cherry'],   
  }
  return HttpResponse(template.render(context, request))    