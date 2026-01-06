<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ name }}</title>
    <link href="/static/normalize.css" rel="stylesheet">
    <link href="/static/logo.png" rel="icon" type="image/x-icon">
</head>

<body style="color: blue">
    <h1>page1</h1>
    <input id="env" value="{{ env }}" style="display: none;">
    <input id="options" value="{{ options }}" style="display: none;">
    <button onclick="getProjectList()">获取项目列表</button>
</body>

<script type="text/javascript">
    try {
        window.env = document.getElementById('env').value
        const options = document.getElementById('options').value
        window.options = JSON.parse(options)
    }
    catch (e) {
        console.error(e)
    }
    const getProjectList = () => {
        fetch('/api/project/list')
            .then(res => res.json())
            .then(data => {
                console.log(data)
            })
            .catch(err => {
                console.error(err)
            })
    }
</script>

</html>