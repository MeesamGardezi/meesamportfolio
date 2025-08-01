@echo off
echo Creating project structure...

REM Create main directories
mkdir pages
mkdir pages\home
mkdir pages\projects
mkdir pages\admin
mkdir shared
mkdir assets
mkdir assets\images

REM Create home page components
mkdir pages\home\hero
mkdir pages\home\about
mkdir pages\home\contact
mkdir pages\home\skills

REM Create projects page components
mkdir pages\projects\projects-grid
mkdir pages\projects\project-detail
mkdir pages\projects\project-filter

REM Create admin page components
mkdir pages\admin\admin-dashboard
mkdir pages\admin\project-management

REM Create shared components
mkdir shared\navbar
mkdir shared\footer
mkdir shared\firebase

REM Create hero component files
echo. > pages\home\hero\hero.html
echo. > pages\home\hero\hero.css
echo. > pages\home\hero\hero.js

REM Create about component files
echo. > pages\home\about\about.html
echo. > pages\home\about\about.css
echo. > pages\home\about\about.js

REM Create contact component files
echo. > pages\home\contact\contact.html
echo. > pages\home\contact\contact.css
echo. > pages\home\contact\contact.js

REM Create skills component files
echo. > pages\home\skills\skills.html
echo. > pages\home\skills\skills.css
echo. > pages\home\skills\skills.js

REM Create projects-grid component files
echo. > pages\projects\projects-grid\projects-grid.html
echo. > pages\projects\projects-grid\projects-grid.css
echo. > pages\projects\projects-grid\projects-grid.js

REM Create project-detail component files
echo. > pages\projects\project-detail\project-detail.html
echo. > pages\projects\project-detail\project-detail.css
echo. > pages\projects\project-detail\project-detail.js

REM Create project-filter component files
echo. > pages\projects\project-filter\project-filter.html
echo. > pages\projects\project-filter\project-filter.css
echo. > pages\projects\project-filter\project-filter.js

REM Create admin-dashboard component files
echo. > pages\admin\admin-dashboard\admin-dashboard.html
echo. > pages\admin\admin-dashboard\admin-dashboard.css
echo. > pages\admin\admin-dashboard\admin-dashboard.js

REM Create project-management component files
echo. > pages\admin\project-management\project-management.html
echo. > pages\admin\project-management\project-management.css
echo. > pages\admin\project-management\project-management.js

REM Create navbar component files
echo. > shared\navbar\navbar.html
echo. > shared\navbar\navbar.css
echo. > shared\navbar\navbar.js

REM Create footer component files
echo. > shared\footer\footer.html
echo. > shared\footer\footer.css
echo. > shared\footer\footer.js

REM Create firebase config file
echo. > shared\firebase\firebase-config.js

REM Create main HTML files
echo. > index.html
echo. > projects.html
echo. > admin.html

echo Project structure created successfully!
echo All folders and empty files have been generated.
pause