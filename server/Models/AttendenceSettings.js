var Model   = useModel('Model');

/**
 * Attendence Settings Model
 */
function AttendenceSettings(){
    this.collection = 'attendence_settings';
}
AttendenceSettings.prototype = new Model;
module.exports = new AttendenceSettings;

