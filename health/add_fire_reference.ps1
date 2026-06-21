$folder = "C:/Users/user/.gemini/antigravity/scratch/Kedi health - Copy/overview"
$fireLink = "[Fire Details](file:///C:/Users/user/.gemini/antigravity/scratch/Kedi%20health%20-%20Copy/fire.md)"
Get-ChildItem -Path $folder -Filter *.md | ForEach-Object {
    $filePath = $_.FullName
    $content = Get-Content $filePath -Raw
    if ($content -notmatch '\[Fire Details\]\(') {
        # Append a blank line then the reference link
        $newContent = $content + "`n`n" + $fireLink + "`n"
        Set-Content -Path $filePath -Value $newContent -Encoding UTF8
        Write-Host "Added Fire reference to $($_.Name)"
    } else {
        Write-Host "Fire reference already present in $($_.Name)"
    }
}
