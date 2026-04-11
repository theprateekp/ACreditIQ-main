Add-Type -AssemblyName System.IO.Compression.FileSystem
$docxPath = "c:\Users\heena\OneDrive\Desktop\AccreditIQ\AccreditIQ_AI_Context_PRD (1).docx"
$zip = [System.IO.Compression.ZipFile]::OpenRead($docxPath)
$entry = $zip.GetEntry("word/document.xml")
$stream = $entry.Open()
$reader = New-Object System.IO.StreamReader($stream)
$xml = [xml]$reader.ReadToEnd()
$reader.Close()
$stream.Close()
$zip.Dispose()
$ns = @{w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
$paragraphs = $xml | Select-Xml -Namespace $ns -XPath "//w:p"
foreach($p in $paragraphs) {
    $texts = $p.Node | Select-Xml -Namespace $ns -XPath ".//w:t"
    $line = ($texts | ForEach-Object { $_.Node.'#text' }) -join ''
    if($line) { Write-Output $line }
}
