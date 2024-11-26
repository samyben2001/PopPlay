from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 2
    page_size_query_param = 'page_size'
    
    def get_paginated_response(self, data):
        return Response({
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'count': self.page.paginator.count,
            'total_pages': self.page.paginator.num_pages,
            'results': data
        })

class NestedStandardResultsSetPagination(StandardResultsSetPagination):
    page_query_param = 'nested_page' # Default query param for nested pagination (override in serializers)
    
    def get_paginated_response(self, data):
        """
        Override to ensure the correct `previous` and `next` links are generated for nested pagination.
        """
        request = self.request
        current_page = self.page.number
        base_url = request.build_absolute_uri()

        # Modify previous link to include 'page_query_param' query parameter
        previous_link = None
        if self.page.has_previous():
            previous_page = current_page - 1
            previous_link = self.replace_query_param(base_url, self.page_query_param, previous_page)

        # Modify next link to include 'page_query_param' query parameter
        next_link = None
        if self.page.has_next():
            next_page = current_page + 1
            next_link = self.replace_query_param(base_url, self.page_query_param, next_page)

        return Response({
            'count': self.page.paginator.count,
            'next': next_link,
            'previous': previous_link,
            'results': data
        })

    def replace_query_param(self, url, param, value):
        """
        Replace or add a query parameter to the URL.
        """
        from urllib.parse import urlencode, urlparse, parse_qsl, urlunparse

        url_parts = urlparse(url)
        query_params = dict(parse_qsl(url_parts.query))
        query_params[param] = value
        new_query = urlencode(query_params)
        return urlunparse(url_parts._replace(query=new_query))