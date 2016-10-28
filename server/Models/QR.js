var Model   = useModel('Model');

/**
 * QR Model
 */
function QR(){
    this.collection = 'qrcodes';
}
QR.prototype = new Model();
module.exports = new QR;
