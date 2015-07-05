exports.config =
    files:
        javascripts: joinTo:
#            'libraries.js': /^(?!app\/)/
            'app.js': /^app\//
        stylesheets: joinTo: 'app.css'
    modules:
        wrapper: false
    plugins:
        on: [ 'brunch-postcss' ]
        postcss:
            processors: [
                require('autoprefixer')(['last 8 versions'])
            ]
