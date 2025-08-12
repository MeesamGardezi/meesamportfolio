@echo off
setlocal enabledelayedexpansion

echo ========================================
echo Portfolio Website Structure Generator
echo "Dream Maker Developer" Project Setup
echo ========================================
echo.

:: Set the root project directory name
set PROJECT_ROOT=portfolio-website

:: Create root directory
echo Creating root directory: %PROJECT_ROOT%
mkdir "%PROJECT_ROOT%" 2>nul
cd "%PROJECT_ROOT%"

echo.
echo Creating directory structure...
echo ----------------------------------------

:: Create public directory and files
echo [PUBLIC]
mkdir "public" 2>nul
type nul > "public\index.html"
type nul > "public\favicon.ico"
type nul > "public\manifest.json"
type nul > "public\robots.txt"
type nul > "public\sitemap.xml"
echo   Created: public\ with core files

:: Create src/assets structure
echo [ASSETS]
mkdir "src\assets\styles\core" 2>nul
type nul > "src\assets\styles\core\variables.css"
type nul > "src\assets\styles\core\reset.css"
type nul > "src\assets\styles\core\typography.css"
type nul > "src\assets\styles\core\layout.css"
type nul > "src\assets\styles\core\animations.css"
echo   Created: styles\core\

mkdir "src\assets\styles\components" 2>nul
type nul > "src\assets\styles\components\buttons.css"
type nul > "src\assets\styles\components\forms.css"
type nul > "src\assets\styles\components\cards.css"
type nul > "src\assets\styles\components\modals.css"
type nul > "src\assets\styles\main.css"
echo   Created: styles\components\

mkdir "src\assets\scripts\core" 2>nul
type nul > "src\assets\scripts\core\app.js"
type nul > "src\assets\scripts\core\router.js"
type nul > "src\assets\scripts\core\component-loader.js"
type nul > "src\assets\scripts\core\utils.js"
echo   Created: scripts\core\

mkdir "src\assets\scripts\services" 2>nul
type nul > "src\assets\scripts\services\firebase-config.js"
type nul > "src\assets\scripts\services\firebase-projects.js"
type nul > "src\assets\scripts\services\firebase-storage.js"
type nul > "src\assets\scripts\services\firebase-analytics.js"
type nul > "src\assets\scripts\services\api-service.js"
echo   Created: scripts\services\

mkdir "src\assets\scripts\modules" 2>nul
type nul > "src\assets\scripts\modules\animation-controller.js"
type nul > "src\assets\scripts\modules\form-handler.js"
type nul > "src\assets\scripts\modules\search-filter.js"
type nul > "src\assets\scripts\modules\lazy-loader.js"
echo   Created: scripts\modules\

mkdir "src\assets\images\static" 2>nul
mkdir "src\assets\images\placeholders" 2>nul
mkdir "src\assets\images\compressed" 2>nul
echo   Created: images directories

mkdir "src\assets\fonts\primary-font" 2>nul
mkdir "src\assets\fonts\secondary-font" 2>nul
mkdir "src\assets\fonts\icon-font" 2>nul
echo   Created: fonts directories

:: Create components structure
echo [COMPONENTS]
mkdir "src\components\layout\header" 2>nul
type nul > "src\components\layout\header\header.html"
type nul > "src\components\layout\header\header.css"
type nul > "src\components\layout\header\header.js"
echo   Created: layout\header\

mkdir "src\components\layout\navigation" 2>nul
type nul > "src\components\layout\navigation\main-nav.html"
type nul > "src\components\layout\navigation\main-nav.css"
type nul > "src\components\layout\navigation\main-nav.js"
type nul > "src\components\layout\navigation\mobile-nav.html"
type nul > "src\components\layout\navigation\mobile-nav.js"
echo   Created: layout\navigation\

mkdir "src\components\layout\footer" 2>nul
type nul > "src\components\layout\footer\footer.html"
type nul > "src\components\layout\footer\footer.css"
type nul > "src\components\layout\footer\footer.js"
echo   Created: layout\footer\

:: Create UI components
mkdir "src\components\ui\loading-spinner" 2>nul
mkdir "src\components\ui\modal" 2>nul
mkdir "src\components\ui\toast-notification" 2>nul
mkdir "src\components\ui\image-gallery" 2>nul
mkdir "src\components\ui\contact-form" 2>nul
mkdir "src\components\ui\search-bar" 2>nul
echo   Created: ui components directories

:: Create business components
mkdir "src\components\business\project-card" 2>nul
mkdir "src\components\business\testimonial-card" 2>nul
mkdir "src\components\business\service-card" 2>nul
mkdir "src\components\business\tech-stack-display" 2>nul
mkdir "src\components\business\process-timeline" 2>nul
echo   Created: business components directories

:: Create pages - Home
echo [PAGES]
mkdir "src\pages\home" 2>nul
type nul > "src\pages\home\index.html"
type nul > "src\pages\home\home.css"
type nul > "src\pages\home\home.js"
echo   Created: pages\home\

:: Create home sections
mkdir "src\pages\home\sections\hero" 2>nul
type nul > "src\pages\home\sections\hero\hero.html"
type nul > "src\pages\home\sections\hero\hero.css"
type nul > "src\pages\home\sections\hero\hero.js"

mkdir "src\pages\home\sections\about-preview" 2>nul
type nul > "src\pages\home\sections\about-preview\about-preview.html"
type nul > "src\pages\home\sections\about-preview\about-preview.css"
type nul > "src\pages\home\sections\about-preview\about-preview.js"

mkdir "src\pages\home\sections\process" 2>nul
type nul > "src\pages\home\sections\process\process.html"
type nul > "src\pages\home\sections\process\process.css"
type nul > "src\pages\home\sections\process\process.js"

mkdir "src\pages\home\sections\featured-projects" 2>nul
type nul > "src\pages\home\sections\featured-projects\featured-projects.html"
type nul > "src\pages\home\sections\featured-projects\featured-projects.css"
type nul > "src\pages\home\sections\featured-projects\featured-projects.js"

mkdir "src\pages\home\sections\services-overview" 2>nul
type nul > "src\pages\home\sections\services-overview\services-overview.html"
type nul > "src\pages\home\sections\services-overview\services-overview.css"
type nul > "src\pages\home\sections\services-overview\services-overview.js"

mkdir "src\pages\home\sections\testimonials" 2>nul
type nul > "src\pages\home\sections\testimonials\testimonials.html"
type nul > "src\pages\home\sections\testimonials\testimonials.css"
type nul > "src\pages\home\sections\testimonials\testimonials.js"

mkdir "src\pages\home\sections\tech-arsenal" 2>nul
type nul > "src\pages\home\sections\tech-arsenal\tech-arsenal.html"
type nul > "src\pages\home\sections\tech-arsenal\tech-arsenal.css"
type nul > "src\pages\home\sections\tech-arsenal\tech-arsenal.js"

mkdir "src\pages\home\sections\main-cta" 2>nul
type nul > "src\pages\home\sections\main-cta\main-cta.html"
type nul > "src\pages\home\sections\main-cta\main-cta.css"
type nul > "src\pages\home\sections\main-cta\main-cta.js"
echo   Created: home page sections

:: Create projects pages
mkdir "src\pages\projects\all-projects" 2>nul
type nul > "src\pages\projects\all-projects\index.html"
type nul > "src\pages\projects\all-projects\all-projects.css"
type nul > "src\pages\projects\all-projects\all-projects.js"

mkdir "src\pages\projects\project-detail" 2>nul
type nul > "src\pages\projects\project-detail\index.html"
type nul > "src\pages\projects\project-detail\project-detail.css"
type nul > "src\pages\projects\project-detail\project-detail.js"
echo   Created: projects pages

:: Create other pages
mkdir "src\pages\about" 2>nul
type nul > "src\pages\about\index.html"
type nul > "src\pages\about\about.css"
type nul > "src\pages\about\about.js"

mkdir "src\pages\services" 2>nul
type nul > "src\pages\services\index.html"
type nul > "src\pages\services\services.css"
type nul > "src\pages\services\services.js"

mkdir "src\pages\contact" 2>nul
type nul > "src\pages\contact\index.html"
type nul > "src\pages\contact\contact.css"
type nul > "src\pages\contact\contact.js"
echo   Created: about, services, contact pages

:: Create admin pages
mkdir "src\pages\admin\dashboard" 2>nul
mkdir "src\pages\admin\project-manager" 2>nul
mkdir "src\pages\admin\testimonial-manager" 2>nul
mkdir "src\pages\admin\analytics" 2>nul
echo   Created: admin pages

:: Create templates
echo [TEMPLATES]
mkdir "src\templates" 2>nul
type nul > "src\templates\base.html"
type nul > "src\templates\page-shell.html"
type nul > "src\templates\project-template.html"

mkdir "src\templates\error-pages" 2>nul
type nul > "src\templates\error-pages\404.html"
type nul > "src\templates\error-pages\500.html"
echo   Created: templates

:: Create config
echo [CONFIG]
mkdir "src\config" 2>nul
type nul > "src\config\firebase-config.js"
type nul > "src\config\environment.js"
type nul > "src\config\routes.js"
type nul > "src\config\constants.js"
echo   Created: config files

:: Create Firebase functions
echo [FIREBASE]
mkdir "firebase-functions\functions" 2>nul
type nul > "firebase-functions\functions\index.js"
type nul > "firebase-functions\functions\contact-handler.js"
type nul > "firebase-functions\functions\analytics-processor.js"
type nul > "firebase-functions\functions\image-optimizer.js"
type nul > "firebase-functions\package.json"
echo   Created: firebase-functions

:: Create admin tools
echo [ADMIN TOOLS]
mkdir "admin-tools" 2>nul
type nul > "admin-tools\data-seeder.js"
type nul > "admin-tools\image-uploader.js"
type nul > "admin-tools\backup-restore.js"
echo   Created: admin-tools

:: Create root configuration files
echo [ROOT FILES]
type nul > "firebase.json"
type nul > "firestore.rules"
type nul > "storage.rules"
type nul > "package.json"
type nul > ".gitignore"
type nul > "README.md"
echo   Created: root configuration files

echo.
echo ========================================
echo SETUP COMPLETE!
echo ========================================
echo.
echo Project structure created successfully!
echo Total directories: ~60+
echo Total files: ~100+
echo.
echo Next steps:
echo 1. Navigate to: %PROJECT_ROOT%
echo 2. Initialize npm: npm init -y
echo 3. Install Firebase: npm install firebase firebase-admin
echo 4. Configure Firebase: firebase init
echo 5. Start development!
echo.
echo Happy coding! Let's make dreams come true!
echo ========================================

pause