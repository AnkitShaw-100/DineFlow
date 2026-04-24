# Fix all @ imports to relative paths
$uiPath = "d:\10_Github\01_Important\05_DineFlow\frontend\src\components\ui"
$dashboardPath = "d:\10_Github\01_Important\05_DineFlow\frontend\src\components\dashboard"
$landingPath = "d:\10_Github\01_Important\05_DineFlow\frontend\src\components\landing"

# Fix UI files
Get-ChildItem "$uiPath\*.jsx" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $content = $content -replace 'from "@/lib/utils"', 'from "../../lib/utils.ts"'
    $content = $content -replace 'from "@/components/ui/([a-zA-Z0-9-]+)"', 'from "./$1.jsx"'
    Set-Content $_.FullName -Value $content
}

# Fix Dashboard files
Get-ChildItem "$dashboardPath\*.jsx" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $content = $content -replace 'from "@/lib/utils"', 'from "../../lib/utils.ts"'
    $content = $content -replace 'from "@/components/ui/([a-zA-Z0-9-]+)"', 'from "../ui/$1.jsx"'
    $content = $content -replace 'from "@/components/dashboard/([a-zA-Z0-9-]+)"', 'from "./$1.jsx"'
    $content = $content -replace 'from "@/assets/([^"]+)"', 'from "../../assets/$1"'
    Set-Content $_.FullName -Value $content
}

# Fix Landing files
Get-ChildItem "$landingPath\*.jsx" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $content = $content -replace 'from "@/lib/utils"', 'from "../../lib/utils.ts"'
    $content = $content -replace 'from "@/components/ui/([a-zA-Z0-9-]+)"', 'from "../ui/$1.jsx"'
    $content = $content -replace 'from "@/assets/([^"]+)"', 'from "../../assets/$1"'
    Set-Content $_.FullName -Value $content
}

# Fix App.jsx and main.jsx
$srcPath = "d:\10_Github\01_Important\05_DineFlow\frontend\src"
Get-ChildItem "$srcPath\*.jsx" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $content = $content -replace 'from "@/components/([^"]+)"', 'from "./components/$1.jsx"'
    $content = $content -replace 'from "@/hooks/([^"]+)"', 'from "./hooks/$1.jsx"'
    $content = $content -replace 'from "@/lib/utils"', 'from "./lib/utils.ts"'
    Set-Content $_.FullName -Value $content
}

Write-Host "All imports fixed!"
