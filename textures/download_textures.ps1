# =====================================================================
# 太阳系贴图一键下载脚本
# 来源 1: https://www.solarsystemscope.com/textures/  (CC-BY 4.0)
# 来源 2: https://stevealbers.net/albers/sos/sos.html (基于 NASA 公开域素材)
# 用法: 在 PowerShell 里跑 .\download_textures.ps1
# =====================================================================

$SSS_BASE = "https://www.solarsystemscope.com/textures/download"
$ALBERS_BASE = "https://stevealbers.net/albers/sos"

# 贴图清单（行星+矮行星来自 SSS，卫星来自 Steve Albers）
$textures = @(
    # ===== 行星与太阳（Solar System Scope，CC-BY 4.0）=====
    @{ Name = "2k_mercury.jpg";            Url = "$SSS_BASE/2k_mercury.jpg";            Desc = "水星 Mercury" }
    @{ Name = "2k_venus_atmosphere.jpg";   Url = "$SSS_BASE/2k_venus_atmosphere.jpg";   Desc = "金星大气 Venus" }
    @{ Name = "2k_earth_daymap.jpg";       Url = "$SSS_BASE/2k_earth_daymap.jpg";       Desc = "地球白天 Earth (day)" }
    @{ Name = "2k_earth_nightmap.jpg";     Url = "$SSS_BASE/2k_earth_nightmap.jpg";     Desc = "地球夜晚 Earth (night)" }
    @{ Name = "2k_earth_clouds.jpg";       Url = "$SSS_BASE/2k_earth_clouds.jpg";       Desc = "地球云层 Earth (clouds)" }
    @{ Name = "2k_mars.jpg";               Url = "$SSS_BASE/2k_mars.jpg";               Desc = "火星 Mars" }
    @{ Name = "2k_jupiter.jpg";            Url = "$SSS_BASE/2k_jupiter.jpg";            Desc = "木星 Jupiter" }
    @{ Name = "2k_saturn.jpg";             Url = "$SSS_BASE/2k_saturn.jpg";             Desc = "土星 Saturn" }
    @{ Name = "2k_saturn_ring_alpha.png";  Url = "$SSS_BASE/2k_saturn_ring_alpha.png";  Desc = "土星环 Saturn Ring" }
    @{ Name = "2k_uranus.jpg";             Url = "$SSS_BASE/2k_uranus.jpg";             Desc = "天王星 Uranus" }
    @{ Name = "2k_neptune.jpg";            Url = "$SSS_BASE/2k_neptune.jpg";            Desc = "海王星 Neptune" }
    @{ Name = "2k_sun.jpg";                Url = "$SSS_BASE/2k_sun.jpg";                Desc = "太阳 Sun" }
    @{ Name = "2k_moon.jpg";               Url = "$SSS_BASE/2k_moon.jpg";               Desc = "月球 Moon" }
    @{ Name = "2k_stars_milky_way.jpg";    Url = "$SSS_BASE/2k_stars_milky_way.jpg";    Desc = "银河 Milky Way" }
    # ===== 矮行星（Solar System Scope，部分程序化填补，CC-BY 4.0）=====
    @{ Name = "2k_ceres_fictional.jpg";    Url = "$SSS_BASE/2k_ceres_fictional.jpg";    Desc = "谷神星 Ceres" }
    @{ Name = "2k_eris_fictional.jpg";     Url = "$SSS_BASE/2k_eris_fictional.jpg";     Desc = "阋神星 Eris" }
    @{ Name = "2k_haumea_fictional.jpg";   Url = "$SSS_BASE/2k_haumea_fictional.jpg";   Desc = "妊神星 Haumea" }
    @{ Name = "2k_makemake_fictional.jpg"; Url = "$SSS_BASE/2k_makemake_fictional.jpg"; Desc = "鸟神星 Makemake" }
    # ===== 卫星（Steve Albers，基于 NASA Voyager/Galileo/Cassini/Juno 公开域素材）=====
    # —— 木星卫星 ——
    @{ Name = "moon_io.jpg";        Url = "$ALBERS_BASE/jupiter/io/io_rgb_cyl.jpg";              Desc = "木卫一 Io (火山世界)" }
    @{ Name = "moon_europa.png";    Url = "$ALBERS_BASE/jupiter/europa/europa_rgb_cyl_juno.png"; Desc = "木卫二 Europa (冰世界)" }
    @{ Name = "moon_ganymede.jpg"; Url = "$ALBERS_BASE/jupiter/ganymede/ganymede_4k.jpg"; Desc = "木卫三 Ganymede (太阳系最大卫星)" }
    @{ Name = "moon_callisto.jpg"; Url = "https://bjj.mmedia.is/data/callisto/callisto.jpg"; Desc = "木卫四 Callisto (来自 Bjorn Jonsson)" }
    # —— 土星卫星 ——
    @{ Name = "moon_mimas.jpg";    Url = "$ALBERS_BASE/saturn/mimas/mimas_rgb_cyl_www.jpg";       Desc = "土卫一 Mimas (死星)" }
    @{ Name = "moon_enceladus.jpg";Url = "$ALBERS_BASE/saturn/enceladus/enceladus_rgb_cyl_www.jpg"; Desc = "土卫二 Enceladus (冰喷泉)" }
    @{ Name = "moon_tethys.jpg";   Url = "$ALBERS_BASE/saturn/tethys/tethys_rgb_cyl_www.jpg";     Desc = "土卫三 Tethys" }
    @{ Name = "moon_dione.jpg";    Url = "$ALBERS_BASE/saturn/dione/dione_rgb_cyl_www.jpg";       Desc = "土卫四 Dione" }
    @{ Name = "moon_rhea.jpg";     Url = "$ALBERS_BASE/saturn/rhea/rhea_rgb_cyl_www.jpg";         Desc = "土卫五 Rhea" }
    @{ Name = "moon_titan.jpg";    Url = "$ALBERS_BASE/saturn/titan/titan_rgb_cyl_www.jpg";       Desc = "土卫六 Titan (橙黄大气)" }
    @{ Name = "moon_iapetus.jpg"; Url = "$ALBERS_BASE/saturn/iapetus/iapetus_rgb_cyl_www.jpg";   Desc = "土卫八 Iapetus (双色)" }
    # —— 天王星卫星 ——
    @{ Name = "moon_miranda.jpg";  Url = "$ALBERS_BASE/uranus/miranda/miranda_rgb_cyl_www.jpg";   Desc = "天卫五 Miranda" }
    @{ Name = "moon_ariel.jpg";    Url = "$ALBERS_BASE/uranus/ariel/ariel_rgb_cyl_www.jpg";       Desc = "天卫一 Ariel" }
    @{ Name = "moon_umbriel.jpg";  Url = "$ALBERS_BASE/uranus/umbriel/umbriel_rgb_cyl_www.jpg";   Desc = "天卫二 Umbriel" }
    @{ Name = "moon_titania.jpg";  Url = "$ALBERS_BASE/uranus/titania/titania_rgb_cyl_www.jpg";   Desc = "天卫三 Titania" }
    @{ Name = "moon_oberon.jpg";   Url = "$ALBERS_BASE/uranus/oberon/oberon_rgb_cyl_www.jpg";     Desc = "天卫四 Oberon" }
    # —— 海王星卫星 ——
    @{ Name = "moon_triton.jpg";   Url = "$ALBERS_BASE/neptune/triton/triton_rgb_cyl_www.jpg";    Desc = "海卫一 Triton (逆行)" }
    # —— 冥卫 ——
    @{ Name = "moon_charon.jpg";   Url = "$ALBERS_BASE/pluto/charon/charon_rgb_cyl.jpg";          Desc = "冥卫一 Charon" }
)

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Write-Host ""
Write-Host "===== 开始下载 $($textures.Count) 个贴图到: $ScriptDir =====" -ForegroundColor Cyan
Write-Host "提示: 卫星贴图来自 stevealbers.net，部分 URL 是按命名规律推测，可能会失败。失败的会列出，不影响其他下载。" -ForegroundColor Gray
Write-Host ""

$success = 0
$skipped = 0
$failed  = 0

foreach ($tex in $textures) {
    $fileName  = $tex.Name
    $fileDesc  = $tex.Desc
    $url       = $tex.Url
    $outputPath= Join-Path $ScriptDir $fileName

    if (Test-Path $outputPath) {
        Write-Host "[跳过] $fileName 已存在 ($fileDesc)" -ForegroundColor Yellow
        $skipped++
        continue
    }

    Write-Host "[下载中] $fileName  -  $fileDesc" -ForegroundColor White
    try {
        Invoke-WebRequest -Uri $url -OutFile $outputPath -UseBasicParsing -ErrorAction Stop
        $sizeKB = [math]::Round((Get-Item $outputPath).Length / 1KB, 1)
        Write-Host "   完成 ($sizeKB KB)" -ForegroundColor Green
        $success++
    } catch {
        Write-Host "   失败: $($_.Exception.Message)" -ForegroundColor Red
        $failed++
    }
}

Write-Host ""
Write-Host "===== 下载结果 =====" -ForegroundColor Cyan
Write-Host "  成功: $success"   -ForegroundColor Green
Write-Host "  已存在(跳过): $skipped" -ForegroundColor Yellow
Write-Host "  失败: $failed"    -ForegroundColor Red
Write-Host ""

if ($failed -gt 0) {
    Write-Host "提示: 失败的可重新跑这个脚本，已下载的会自动跳过" -ForegroundColor Yellow
}
