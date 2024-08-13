# Define the port and file to open
$Port = 9000
$FilePath = "assets/index.html"
$Url = "http://localhost:$Port/$FilePath"

# Function to start the Python HTTP server
function Start-PythonHttpServer {
    $pythonExe = if (Get-Command python3 -ErrorAction SilentlyContinue) { "python3" } else { "python" }
    if (Get-Command $pythonExe -ErrorAction SilentlyContinue) {
        Start-Process $pythonExe -ArgumentList "-m http.server $Port" -NoNewWindow
    } else {
        Write-Error "Python not found. Please install Python."
        exit 1
    }
}

# Function to open the URL in the default web browser
function Open-Url {
    Start-Process $Url
}

# Start the HTTP server
Start-PythonHttpServer

# Wait for the server to start
Start-Sleep -Seconds 2

# Open the URL
Open-Url