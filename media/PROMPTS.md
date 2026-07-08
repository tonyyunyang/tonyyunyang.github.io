# Paper videos — round 2 "kinetic Swiss poster" (SHIPPED 2026-07-08)

Videos live here as `media/<slug>.mp4`; gallery cards autoplay them muted,
paper pages show them full-bleed with a default-muted `.sound-btn` toggle.

## Design language (approved by Tony)

Warm paper-white studio, charcoal-black graphic elements, exactly ONE accent
color per paper (cobalt / orange / yellow / red / green). Each video is a
~15 s continuous take telling the paper's mechanism in three beats
(input → core operation → outcome), with morph/camera transitions between
beats (no hard cuts) and a settled final hold so plain replay cuts softly.

## Pipeline

- `doubao-seedance-2-0-260128`, 1080p, 16:9, `duration: 15`,
  `watermark: false`, `generate_audio: true`; prompts in Chinese using the
  official 镜头1/2/3 storyboard formula with 转场 lines and a constraint tail
  (no words/letters/digits, no logo/watermark; ✓/arrows/waveforms allowed).
- Post: straight H.264 CRF22 yuv420p `+faststart` re-encode with 0.3 s/0.4 s
  audio fades (no loop crossfade in this round). Cost: 731,025 tokens per
  15 s video. Task video URLs die after 24 h — download immediately.
- Review protocol: 12-frame montage + three full-res keyframes per video,
  judged at 2× zoom before deploying.

## Shipped files & seeds

| slug | seed | verdict at ship time |
|---|---|---|
| twinrouterbench | 99830 | clean pass |
| mera | 88183 | accepted with blemish: faint pseudo-text on SkillBook pages (zoom-only) |
| emotion-vr | 96486 | accepted with blemish: left dial mask garbled (zoom-only) |
| reverse-imaging | 44325 | accepted (credits exhausted): shows 2 property maps instead of 3; output fan drifts to chest X-rays |
| pruning-nnunet | 54957 | accepted (credits exhausted): network reads as furry V, not stepped U |

A staged fix wave exists in the session scratchpad (`jobs-v6.json`):
video-edits to blank the MERA book + replace the emotion masks, and full
regenerations for reverse-imaging (exactly-three maps, same-heart fan) and
pruning (explicit five-step wide U). ~731 k tokens per video if credits return.
Raw 15 s masters are backed up in `~/Documents/seedance-v5-masters/`.

## Final prompts (sent verbatim)

### twinrouterbench.mp4 — cobalt

> 镜头1：浅暖白纸质工作室背景，正面中景缓缓平移跟随：一条黑色细线勾边的白色方形卡片带自左向右逐格自绘展开，宛如一条胶片；行进至中段，最新一格卡片轻轻翻起并填充为饱和钴蓝色，微微悬浮突出。<纸面滑动的轻响与清脆的翻卡声> 转场：镜头缓缓推进钻入这格蓝色卡片，卡片边缘扩展充满全屏，其内部自然展开成一个立体舞台。镜头2：舞台右侧立着三座由大到小阶梯排列的哑光白方块；左侧一颗发光的钴蓝色圆球滚入，先跃上最大方块顶端，随即像下台阶一样逐级跳落，最终稳稳落入最小方块，方块亮起蓝光；上方一根黑色细横条同步收缩到一半长度，一枚炭黑色对勾如盖章般利落落下。<圆球逐级落下的弹性音阶，盖章的沉稳落定音> 转场：镜头缓缓拉远，蓝色卡片舞台折叠缩回卡片带中。镜头3：画面中整齐排布数十条平行卡片带，炭黑色对勾如波浪般快速依次盖满各条卡片带；最下方一条更大的卡片带仍在实时逐格生长，每新增一格便有蓝色圆球快速完成一次逐级跳落。全画面动作渐次平息，静稳定格。<密集轻盈的盖章声浪，配乐平稳收束> 风格：瑞士平面设计风格的极简三维动效，如一张会动的海报；浅暖白纸质背景，哑光白与炭黑图形元素，钴蓝色为唯一强调色；柔和均匀棚拍光，轻柔纸面阴影；动作精准利落、缓入缓出，全片如一镜到底般流畅，分镜之间以元素变形与镜头运动无缝衔接，无硬切换。电影质感，高清，细节丰富。允许出现对勾、箭头等图形符号，但不出现任何文字、字母或数字；保持无字幕，不要生成Logo，不要生成水印，避免闪烁、抖动与物体错乱变形。（极简电子氛围配乐，轻盈克制）

### mera.mp4 — orange

> 镜头1：浅暖白纸质工作室，中景：一条黑色细线轨道上，一串炭黑色小圆珠匀速向右流动；轨道前方分叉成Y形，通向两个圆环——大圆环泛着深橙色光晕，小圆环只有淡淡微光；分叉处一枚白色小拨片左右摆动分派圆珠，多数圆珠被导向大圆环，大圆环每次接收都沉重地闪一次深橙色。<圆珠滚动的细密声与拨片轻响> 转场：镜头顺着几颗形状相同的圆珠向下平移，它们经过时在纸面上留下一个个相同的橙色印记。镜头2：这些橙色印记滑聚成一叠卡片，依次插入一本悬浮展开的白色索引册，册页逐页翻动增厚；随后其中一张卡片抽出并化作橙色光流注入小圆环，小圆环外缘浮现一圈橙色环纹并微微增大变亮。<纸页翻动声与温润的能量注入嗡鸣> 转场：索引册、大圆环、小圆环缓缓滑动排成三角形，三者之间亮起黑色细线回路。镜头3：一道橙色脉冲沿三角回路依次流转；每流转一周，Y形拨片的分派便明显偏移一次——越来越多圆珠改道流入小圆环，小圆环稳定明亮，大圆环渐渐柔和变暗；画面下方一根黑色横向量条逐段缩短到一半长度后锁定，旁边亮起一枚炭黑色对勾；圆珠流持续平稳流动，画面静稳定格。<循环脉冲的节奏音，落定确认音，配乐收束> 风格：（同上，橙色为唯一强调色）

### emotion-vr.mp4 — yellow

> 镜头1：浅暖白纸质工作室，侧面中景：一个哑光白极简风格的人物头像侧影佩戴白色简约VR头显；面前展开一条弧形环绕的亮黄色全景幕带，幕带上的极简图形场景缓缓演变——由圆润太阳与舒展波浪渐变为尖锐折线与低垂乌云，人物随之轻轻前倾。<空灵环境音随场景由明快转为低沉> 转场：镜头绕至人物正面并缓缓推进，穿过头显镜片，圆形镜框扩展扫过全屏。镜头2：镜片内部：一只炭黑色线条勾勒的风格化大眼睛占据画面中央，四周环绕微小的摄像头指示点；眉线轻轻上挑，眼睑细微颤动，瞳孔随幕带变暗而缓缓放大；一枚亮黄色光点在下方微缩幕带上快速游走，实时描出折线轨迹并在注视点留下圆斑。<细腻快门声与轻快扫视音> 转场：画面中的三层信息各自剥离为三条飘带——眼部特写连续帧带、黄色注视折线带、瞳孔起伏波形带——镜头缓缓拉远跟随。镜头3：三条飘带优雅地编织汇入一枚缓缓旋转的白色立方体，立方体各面隐约透出三种飘带纹样；立方体上方升起一个黑色细线半圆表盘，指针在三张极简面具——平静、喜悦、恐惧——之间平滑摆动，最终稳稳落定其一，旁边亮起一枚炭黑色对勾，画面静稳定格。<三股声部汇聚合鸣，指针落定轻响，配乐收束> 风格：（同上，亮黄色为唯一强调色；人物与眼睛保持极简风格化，避免写实人脸）

### reverse-imaging.mp4 — red

> 镜头1：浅暖白纸质影像工作室，特写：一张方形灰阶心脏磁共振切面图悬浮于画面中央的黑色细线展架上，影像中的心脏以缓慢节律轻轻搏动。<低沉柔和的磁共振嗡鸣> 转场：镜头缓缓左移，影像同步向左滑动、倒退着没入一面竖直的玻璃薄板，如纸张送入扫描仪。镜头2：玻璃板另一侧，影像逆向分解为三张纵向错落悬浮的心脏图——解剖轮廓完全相同而质感各异：一张均匀明亮、一张对比强烈、一张柔和细腻；纤细的红色丝线在三张图之间穿引浮动，将它们轻轻拉正、精确对齐。<玻璃解构的清脆声与柔和的校准音> 转场：三张图利落地叠合为一，向前重新穿回玻璃板。镜头3：玻璃板右侧连续展开一整扇十余张方形心脏影像，呈弧形铺开如展开的卡牌，每张明暗对比各不相同；随后第一张影像上一圈红色轮廓线沿心肌精确描出，并快速依次复制到扇面每一张影像上，炭黑色对勾沿扇面依次轻快亮起；扇面轻柔起伏，画面静稳定格。<扇形展开的连贯扫描音，整齐的确认音列，配乐收束> 风格：（同上，红色为唯一强调色；心脏影像保持图形化医学插画质感，避免血腥与写实器官）

### pruning-nnunet.mp4 — green

> 镜头1：浅暖白纸质工作室，全景：画面中央悬浮一座由数千根黑色发丝般细线织成的U字形网络——左臂阶梯式逐层下行，谷底最窄，右臂阶梯式逐层上行，两臂顶端线束最浓密；一张灰阶医学切片小卡从左臂顶端滑入，沿U形逐层下行、穿过谷底、逐层上行，所经层级依次亮起微光，最终从右臂顶端滑出，卡面多出一圈精确贴合的绿色轮廓线。<数据流经网络的柔和电子脉动> 转场：镜头顺着U形缓缓推进下沉，聚焦谷底。镜头2：谷底特写：该区域大量细线渐次松脱、断离，化作细碎黑色尘屑飘散淡出，而两臂顶端附近的粗壮线束反而收紧、泛起淡淡绿光保持完好；画面右侧一根黑色竖直量柱平滑骤降至原高度的五分之一并锁定。<细线断离的细碎清脆声> 转场：镜头缓缓拉远回到全景，网络已变得稀疏轻盈、结构清爽。镜头3：第二张切片小卡滑入这座骨架网络，以明显更轻快的速度走完同样的U形旅程，滑出时同样带着绿色轮廓；它与第一张结果卡并排靠拢、完全重合地叠为一张，两圈绿色轮廓严丝合缝合为一圈，一枚炭黑色对勾利落亮起；轻盈的网络泛起一圈淡绿微光，画面静稳定格。<更轻快的电子脉动，落定确认音，配乐收束> 风格：（同上，绿色为唯一强调色）
