# Model Details 자료 출처

2026-10-19에 아래 공식 GitHub 저장소의 README 및 모델 문서를 직접 확인했습니다. 앱의 설명은 문서를 짧게 요약한 내용이며, 추천 용도는 문서에 기재된 기능을 바탕으로 작성했습니다. 출시일은 공식 저장소 또는 제작사의 공식 발표에서 확인했으며, 화면에는 링크 대신 `Released Date`를 표시합니다.

| 앱의 모델 | 공식 GitHub | 이미지 자료 |
| --- | --- | --- |
| MiniMax H3 | [MiniMax-AI/MiniMax-H3](https://github.com/MiniMax-AI/MiniMax-H3) | 저장소의 `assets/t2va.mp4`, `assets/r2va.mp4`에서 추출한 정지 화면 |
| Fast H3 | [hao-ai-lab/FastVideo](https://github.com/hao-ai-lab/FastVideo) | MiniMax H3 기반 모델 계열의 기존 예시 정지 화면을 공유하며, Fast H3가 직접 생성한 결과라고 표시하지 않음 |
| HunyuanVideo 1.5 | [Tencent-Hunyuan/HunyuanVideo-1.5](https://github.com/Tencent-Hunyuan/HunyuanVideo-1.5) | README의 image-to-video 예제 입력 이미지 2장 |
| Wan 2.2 | [Wan-Video/Wan2.2](https://github.com/Wan-Video/Wan2.2) | `examples/Five Hundred Miles.png`, `examples/i2v_input.JPG` |
| LTX-2.5 | [Lightricks/LTX-2](https://github.com/Lightricks/LTX-2) | 공식 README에 연결된 LTX-2 계열 데모 영상의 정지 화면 2장 |
| LTX-2.3 | [LTX-2.3 모델 문서](https://github.com/Lightricks/LTX-2/blob/main/MODELS-LTX-2.3.md) | 같은 LTX-2 계열 데모 영상의 정지 화면 |
| LTX-2.3 Fast | [LTX-2.3 모델 문서](https://github.com/Lightricks/LTX-2/blob/main/MODELS-LTX-2.3.md) | 같은 LTX-2 계열 데모 영상의 정지 화면 |
| Kandinsky 5.0 | [kandinskylab/kandinsky-5](https://github.com/kandinskylab/kandinsky-5) | `assets/generation_examples/images/1.jpg`, `2.jpg` |
| CogVideoX-5B | [zai-org/CogVideo](https://github.com/zai-org/CogVideo) | 공식 Gradio 데모의 `camping.png`, `beach.png` 입력 이미지 |
| LongCat Avatar | [MeiGen-AI/LongCat-Video-Avatar](https://github.com/MeiGen-AI/LongCat-Video-Avatar) | `videos/demo2/i2v_singer_9.png`, `videos/actor2/actor_13_new.mp4` 정지 화면 |
| MOVA | [OpenMOSS/MOVA](https://github.com/OpenMOSS/MOVA) | `assets/single_person.jpg`, `assets/multi_person.png` |

LTX-2.3 Fast는 디자인상의 이름으로, 공식 문서의 LTX-2.3 distilled 체크포인트에 대응시켰습니다. 세 LTX 항목의 이미지는 저장소가 제공하는 **모델 계열 공통 예시**입니다. 특정 버전이나 체크포인트로 각각 생성한 결과물이라고 표시하지 않습니다. LTX-2.3이 표기된 [이전 README](https://github.com/Lightricks/LTX-2/blob/10c99798cd4077d3fb1afd19e5285067935c0456/README.md)에서도 동일한 데모 영상 링크를 확인했습니다.

## 출시일 근거

- MiniMax H3: 2026-07-31. [MiniMax 공식 출시 발표](https://www.minimax.io/blog/minimax-h3)의 모델 발표일입니다.
- Fast H3: 2026-08-27. FastVideo 공식 README의 FastH3 Preview v1 공개일을 사용합니다. 4-step Preview와 후속 8-step V2의 기능을 구분해 모델 계열의 특징으로 표시했습니다.
- HunyuanVideo 1.5: 2025-11-20. 공식 저장소 README의 News를 따릅니다.
- Wan 2.2: 2025-07-28. 공식 저장소 README의 News를 따릅니다.
- LTX-2.5: 2026-08-11. [공식 v1.2.0 릴리스](https://github.com/Lightricks/LTX-2/releases/tag/v1.2.0) 및 [공식 라이선스의 모델 공개일](https://github.com/Lightricks/LTX-2/blob/main/LICENSE)을 따릅니다.
- LTX-2.3 / LTX-2.3 Fast: 2026-03-05. [공식 모델 출시 발표](https://ltx.io/newsroom/ltx-2-3-offers-creative-intelligence-without-the-cloud-costs) 및 [두 변형의 공식 변경 이력](https://docs.ltx.io/api-changelog/2026/3/5)을 따릅니다. 앱의 Fast 체크포인트 대응 관계는 위 설명과 같습니다.
- Kandinsky 5.0: 2025-09-29. 공식 README의 모델 계열 최초 공개인 T2V Lite 공개일을 사용합니다. Pro 모델의 후속 공개일은 2025-11-20입니다.
- CogVideoX-5B: 2024-08-27. 공식 저장소의 News를 따릅니다.
- LongCat Avatar: 2025-12-16. 공식 저장소의 News를 따릅니다.
- MOVA: 2026-01-29. 공식 저장소의 News를 따릅니다.

입력 이미지와 생성 예시, 영상의 정지 화면은 앱의 이미지 대체 텍스트에서 구분했습니다. 외부 이미지 서버에 의존하지 않도록 자료를 로컬에 포함했습니다. 원본 URL, 추출 시점, 해상도, SHA-256은 [public/assets/models/SOURCES.json](public/assets/models/SOURCES.json)에 있습니다. 이미지의 권리는 각 원저작자에게 있으며 모델과 에셋 사용에는 각 저장소의 라이선스가 적용됩니다.

모델 카드의 이름·제작자 표시 문구는 Figma를 따릅니다. 실제 기능에 대한 설명은 공식 저장소를 따르며, IP 주소·설치 용량·설치 상태는 데모용입니다. 앱은 모델 파일을 내려받거나 실제 설치 작업을 수행하지 않습니다.
