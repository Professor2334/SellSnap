$f = 'app\globals.css'
$lines = [System.IO.File]::ReadAllLines($f, [System.Text.Encoding]::UTF8)
$kept = $lines[0..1955]
[System.IO.File]::WriteAllLines($f, $kept, [System.Text.Encoding]::UTF8)
Write-Host "Done. Total lines kept: $($kept.Count)"
