import { UpdateServiceRenderer } from '../../libs/renderer';

const $app = document.getElementById('app');
const $btn_checkUpdate = document.getElementById('checkUpdate');
const $btn_confirmDownload = document.getElementById('confirmDownload');
const $btn_confirmUpdate = document.getElementById('confirmUpdate');
const $btn_testLogger = document.getElementById('testLogger');

const updateRenderer = new UpdateServiceRenderer();

$app.innerHTML = 'Hello World';
$btn_checkUpdate.onclick = ()=>{
  updateRenderer.checkUpdate();
};
$btn_confirmDownload.onclick = ()=>{
  updateRenderer.confirmDownload();
};
$btn_confirmUpdate.onclick = ()=>{
  updateRenderer.confirmUpdate();
};
$btn_testLogger.onclick = ()=>{
  window['logger']?.error?.('[Event][test]:test-report', {
    from: 'test'
  });
};
updateRenderer.onCheckingUpdate(()=>{
  console.log('检查更新中');
});
updateRenderer.onUpdateFail((msg)=>{
  console.log('更新失败', msg);
});
