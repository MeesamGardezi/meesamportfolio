@echo off
echo Creating Portfolio Website Structure...

:: Create main directory
mkdir portfolio-website
cd portfolio-website

:: Create layouts directory structure
mkdir layouts\base
mkdir layouts\page
mkdir layouts\admin

:: Create layouts files
echo. > layouts\base\base.html
echo. > layouts\base\base.css
echo. > layouts\base\base.js
echo. > layouts\page\page.html
echo. > layouts\page\page.css
echo. > layouts\page\page.js
echo. > layouts\admin\admin.html
echo. > layouts\admin\admin.css
echo. > layouts\admin\admin.js

:: Create components directory structure
mkdir components\navigation\navbar
mkdir components\navigation\footer
mkdir components\navigation\breadcrumb
mkdir components\ui\button
mkdir components\ui\modal
mkdir components\ui\notification
mkdir components\ui\loading
mkdir components\ui\pagination
mkdir components\forms\contact-form
mkdir components\forms\project-form
mkdir components\forms\login-form
mkdir components\forms\search-form
mkdir components\cards\project-card
mkdir components\cards\skill-card
mkdir components\cards\stats-card
mkdir components\gallery\image-gallery
mkdir components\gallery\lightbox
mkdir components\gallery\thumbnail-grid
mkdir components\filters\project-filter
mkdir components\filters\search-filter

:: Create navigation components
echo. > components\navigation\navbar\navbar.html
echo. > components\navigation\navbar\navbar.css
echo. > components\navigation\navbar\navbar.js
echo. > components\navigation\footer\footer.html
echo. > components\navigation\footer\footer.css
echo. > components\navigation\footer\footer.js
echo. > components\navigation\breadcrumb\breadcrumb.html
echo. > components\navigation\breadcrumb\breadcrumb.css
echo. > components\navigation\breadcrumb\breadcrumb.js

:: Create UI components
echo. > components\ui\button\button.html
echo. > components\ui\button\button.css
echo. > components\ui\button\button.js
echo. > components\ui\modal\modal.html
echo. > components\ui\modal\modal.css
echo. > components\ui\modal\modal.js
echo. > components\ui\notification\notification.html
echo. > components\ui\notification\notification.css
echo. > components\ui\notification\notification.js
echo. > components\ui\loading\loading.html
echo. > components\ui\loading\loading.css
echo. > components\ui\loading\loading.js
echo. > components\ui\pagination\pagination.html
echo. > components\ui\pagination\pagination.css
echo. > components\ui\pagination\pagination.js

:: Create form components
echo. > components\forms\contact-form\contact-form.html
echo. > components\forms\contact-form\contact-form.css
echo. > components\forms\contact-form\contact-form.js
echo. > components\forms\project-form\project-form.html
echo. > components\forms\project-form\project-form.css
echo. > components\forms\project-form\project-form.js
echo. > components\forms\login-form\login-form.html
echo. > components\forms\login-form\login-form.css
echo. > components\forms\login-form\login-form.js
echo. > components\forms\search-form\search-form.html
echo. > components\forms\search-form\search-form.css
echo. > components\forms\search-form\search-form.js

:: Create card components
echo. > components\cards\project-card\project-card.html
echo. > components\cards\project-card\project-card.css
echo. > components\cards\project-card\project-card.js
echo. > components\cards\skill-card\skill-card.html
echo. > components\cards\skill-card\skill-card.css
echo. > components\cards\skill-card\skill-card.js
echo. > components\cards\stats-card\stats-card.html
echo. > components\cards\stats-card\stats-card.css
echo. > components\cards\stats-card\stats-card.js

:: Create gallery components
echo. > components\gallery\image-gallery\image-gallery.html
echo. > components\gallery\image-gallery\image-gallery.css
echo. > components\gallery\image-gallery\image-gallery.js
echo. > components\gallery\lightbox\lightbox.html
echo. > components\gallery\lightbox\lightbox.css
echo. > components\gallery\lightbox\lightbox.js
echo. > components\gallery\thumbnail-grid\thumbnail-grid.html
echo. > components\gallery\thumbnail-grid\thumbnail-grid.css
echo. > components\gallery\thumbnail-grid\thumbnail-grid.js

:: Create filter components
echo. > components\filters\project-filter\project-filter.html
echo. > components\filters\project-filter\project-filter.css
echo. > components\filters\project-filter\project-filter.js
echo. > components\filters\search-filter\search-filter.html
echo. > components\filters\search-filter\search-filter.css
echo. > components\filters\search-filter\search-filter.js

:: Create sections directory structure
mkdir sections\home\hero
mkdir sections\home\about
mkdir sections\home\skills
mkdir sections\home\featured-projects
mkdir sections\home\contact
mkdir sections\projects\projects-header
mkdir sections\projects\projects-grid
mkdir sections\projects\projects-sidebar
mkdir sections\project-detail\project-header
mkdir sections\project-detail\project-gallery
mkdir sections\project-detail\project-content
mkdir sections\project-detail\project-sidebar
mkdir sections\project-detail\related-projects
mkdir sections\contact\contact-header
mkdir sections\contact\contact-info
mkdir sections\contact\social-links
mkdir sections\admin\dashboard
mkdir sections\admin\projects-management
mkdir sections\admin\contacts-management
mkdir sections\admin\analytics

:: Create home sections
echo. > sections\home\hero\hero.html
echo. > sections\home\hero\hero.css
echo. > sections\home\hero\hero.js
echo. > sections\home\about\about.html
echo. > sections\home\about\about.css
echo. > sections\home\about\about.js
echo. > sections\home\skills\skills.html
echo. > sections\home\skills\skills.css
echo. > sections\home\skills\skills.js
echo. > sections\home\featured-projects\featured-projects.html
echo. > sections\home\featured-projects\featured-projects.css
echo. > sections\home\featured-projects\featured-projects.js
echo. > sections\home\contact\contact.html
echo. > sections\home\contact\contact.css
echo. > sections\home\contact\contact.js

:: Create projects sections
echo. > sections\projects\projects-header\projects-header.html
echo. > sections\projects\projects-header\projects-header.css
echo. > sections\projects\projects-header\projects-header.js
echo. > sections\projects\projects-grid\projects-grid.html
echo. > sections\projects\projects-grid\projects-grid.css
echo. > sections\projects\projects-grid\projects-grid.js
echo. > sections\projects\projects-sidebar\projects-sidebar.html
echo. > sections\projects\projects-sidebar\projects-sidebar.css
echo. > sections\projects\projects-sidebar\projects-sidebar.js

:: Create project-detail sections
echo. > sections\project-detail\project-header\project-header.html
echo. > sections\project-detail\project-header\project-header.css
echo. > sections\project-detail\project-header\project-header.js
echo. > sections\project-detail\project-gallery\project-gallery.html
echo. > sections\project-detail\project-gallery\project-gallery.css
echo. > sections\project-detail\project-gallery\project-gallery.js
echo. > sections\project-detail\project-content\project-content.html
echo. > sections\project-detail\project-content\project-content.css
echo. > sections\project-detail\project-content\project-content.js
echo. > sections\project-detail\project-sidebar\project-sidebar.html
echo. > sections\project-detail\project-sidebar\project-sidebar.css
echo. > sections\project-detail\project-sidebar\project-sidebar.js
echo. > sections\project-detail\related-projects\related-projects.html
echo. > sections\project-detail\related-projects\related-projects.css
echo. > sections\project-detail\related-projects\related-projects.js

:: Create contact sections
echo. > sections\contact\contact-header\contact-header.html
echo. > sections\contact\contact-header\contact-header.css
echo. > sections\contact\contact-header\contact-header.js
echo. > sections\contact\contact-info\contact-info.html
echo. > sections\contact\contact-info\contact-info.css
echo. > sections\contact\contact-info\contact-info.js
echo. > sections\contact\social-links\social-links.html
echo. > sections\contact\social-links\social-links.css
echo. > sections\contact\social-links\social-links.js

:: Create admin sections
echo. > sections\admin\dashboard\dashboard.html
echo. > sections\admin\dashboard\dashboard.css
echo. > sections\admin\dashboard\dashboard.js
echo. > sections\admin\projects-management\projects-management.html
echo. > sections\admin\projects-management\projects-management.css
echo. > sections\admin\projects-management\projects-management.js
echo. > sections\admin\contacts-management\contacts-management.html
echo. > sections\admin\contacts-management\contacts-management.css
echo. > sections\admin\contacts-management\contacts-management.js
echo. > sections\admin\analytics\analytics.html
echo. > sections\admin\analytics\analytics.css
echo. > sections\admin\analytics\analytics.js

:: Create pages directory structure
mkdir pages\home
mkdir pages\projects
mkdir pages\project-detail
mkdir pages\contact
mkdir pages\admin

:: Create page files
echo. > pages\home\index.html
echo. > pages\home\index.css
echo. > pages\home\index.js
echo. > pages\projects\projects.html
echo. > pages\projects\projects.css
echo. > pages\projects\projects.js
echo. > pages\project-detail\project-detail.html
echo. > pages\project-detail\project-detail.css
echo. > pages\project-detail\project-detail.js
echo. > pages\contact\contact.html
echo. > pages\contact\contact.css
echo. > pages\contact\contact.js
echo. > pages\admin\admin.html
echo. > pages\admin\admin.css
echo. > pages\admin\admin.js

:: Create core directory structure
mkdir core\styles
mkdir core\scripts
mkdir core\config

:: Create core files
echo. > core\styles\variables.css
echo. > core\styles\reset.css
echo. > core\styles\typography.css
echo. > core\styles\utilities.css
echo. > core\styles\animations.css
echo. > core\scripts\utils.js
echo. > core\scripts\firebase.js
echo. > core\scripts\router.js
echo. > core\scripts\component-loader.js
echo. > core\scripts\template-engine.js
echo. > core\config\env.js
echo. > core\config\constants.js
echo. > core\config\firebase-config.js

:: Create assets directory structure
mkdir assets\images
mkdir assets\icons
mkdir assets\fonts
mkdir assets\static

:: Create build directory structure
mkdir build\components
mkdir build\pages
mkdir build\assets

:: Create tools directory
mkdir tools

:: Create tools files
echo. > tools\build.js
echo. > tools\component-compiler.js
echo. > tools\dev-server.js
echo. > tools\deploy.js

:: Create root files
echo. > index.html
echo. > package.json
echo. > README.md
echo. > .gitignore

echo.
echo ✅ Portfolio website structure created successfully!
echo.
echo Next steps:
echo 1. Navigate to the portfolio-website directory
echo 2. Set up the custom template engine
echo 3. Create your first components
echo.
pause