{
    'name': "Odoo automatic timetables  Out",

    'summary': """
          Odoo automatic timetables  Out
        """,

    'description':
        """
          Horarios
        """,

    'author': "Oohel Technologies S.A de C.V MCR",
    'website': "http://oohel.net",

    'category': 'Extra Tools',
    'version': '1.0',

    'depends': [
        'base',
        'horarios',
        'openeducat_classroom',
        'escolares',
        'alumnos',
        'profesores',
    ],

    'demo': [],

    'data': [
        'templates/panel_configuracion_horario.xml',
        'templates/horarios_simple.xml',
    ],

    'installable': True,
    'auto_install': False,
    'application': True,
}
