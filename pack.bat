@echo off
REM DIP轻量工具包打包脚本
REM 将工具包打包为ZIP文件以便分发

echo ========================================
echo DIP轻量工具包打包工具
echo ========================================
echo.

REM 检查是否在正确的目录
if not exist "index.html" (
    echo 错误：请在dip-toolkit目录下运行此脚本
    pause
    exit /b 1
)

REM 设置变量
set "TOOLKIT_NAME=DIP轻量工具包"
set "VERSION=v1.0.0"
set "DATE=%date:~0,4%%date:~5,2%%date:~8,2%"
set "ZIP_FILE=%TOOLKIT_NAME%_%VERSION%_%DATE%.zip"

echo 正在准备打包文件...
echo.

REM 创建临时目录
if exist "temp_package" rmdir /s /q "temp_package"
mkdir "temp_package"

REM 复制必要文件
echo 复制主文件...
copy "index.html" "temp_package\" >nul
copy "README.md" "temp_package\" >nul
copy "test.html" "temp_package\" >nul

echo 复制CSS文件...
xcopy "css" "temp_package\css" /E /I /Y >nul

echo 复制JavaScript文件...
xcopy "js" "temp_package\js" /E /I /Y >nul

echo 复制数据目录...
if exist "data" (
    xcopy "data" "temp_package\data" /E /I /Y >nul
) else (
    mkdir "temp_package\data"
    echo 数据目录已创建（空目录） > "temp_package\data\README.txt"
)

REM 创建使用说明文件
echo 创建使用说明...
(
echo DIP轻量工具包使用说明
echo ======================
echo.
echo 版本：%VERSION%
echo 打包日期：%date%
echo.
echo 使用方法：
echo 1. 解压本ZIP文件到任意目录
echo 2. 用浏览器打开 index.html 文件
echo 3. 无需安装，直接开始使用
echo.
echo 功能模块：
echo - 预分组速查表：查询DIP分组信息
echo - 病案首页自检清单：检查病案首页质量
echo - 费用偏离预警计算器：计算费用偏离度
echo.
echo 注意事项：
echo 1. 本工具完全离线可用
echo 2. 数据存储在浏览器本地
echo 3. 建议定期导出数据备份
echo 4. 更多信息请查看README.md
echo.
echo 技术支持：
echo 如有问题，请参考README.md中的联系方式
) > "temp_package\使用说明.txt"

REM 创建版本信息文件
(
echo {
echo   "name": "%TOOLKIT_NAME%",
echo   "version": "%VERSION%",
echo   "buildDate": "%date%",
echo   "features": [
echo     "预分组速查表",
echo     "病案首页自检清单", 
echo     "费用偏离预警计算器"
echo   ],
echo   "offline": true,
echo   "requirements": "现代浏览器（支持HTML5和本地存储）"
echo }
) > "temp_package\version.json"

REM 打包为ZIP文件
echo.
echo 正在创建ZIP文件：%ZIP_FILE%

REM 使用PowerShell创建ZIP文件（Windows 7+）
powershell -Command "Compress-Archive -Path 'temp_package\*' -DestinationPath '%ZIP_FILE%' -Force"

if exist "%ZIP_FILE%" (
    echo.
    echo 打包成功！
    echo 生成的ZIP文件：%ZIP_FILE%
    echo 文件大小： 
    for %%F in ("%ZIP_FILE%") do echo        %%~zF 字节
) else (
    echo.
    echo 打包失败！
    echo 请检查是否安装了PowerShell
)

REM 清理临时文件
echo.
echo 清理临时文件...
if exist "temp_package" rmdir /s /q "temp_package"

echo.
echo ========================================
echo 打包完成！
echo ========================================
echo.
echo 下一步：
echo 1. 将 %ZIP_FILE% 分发给用户
echo 2. 用户解压后即可使用
echo 3. 建议用户运行 test.html 进行功能测试
echo.
pause
