export function normalizeAudioSettings({musicVolume=0.35,voiceVolume=1}={}){
  return {musicVolume:Math.max(0,Math.min(1,Number(musicVolume)||0)),voiceVolume:Math.max(0,Math.min(1,Number(voiceVolume)||0))};
}
