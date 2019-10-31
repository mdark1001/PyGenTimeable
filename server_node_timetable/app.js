/**
 * Created by miguel on 22/03/19.
 */
let app = require('express')();
let http = require('http').Server(app);
const PORT = 3000;
let io = require('socket.io')(http);
let connetion = require('./connect')(io);

const bodyParser = require('body-parser');
let HORARIO_MATERIA_GRUPO = {};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.get('/send_validacion_pago', function (req, res) {
    let {alumno_id, plan_id} = req.query;
    //console.log(AlumnoManager.ALUMNOS_PLANES[plan_id]);
    if (alumno_id && plan_id && AlumnoManager.ALUMNOS_PLANES[plan_id]) {
        AlumnoManager.ALUMNOS_PLANES[plan_id].forEach((i) => {
            //console.log(i.socket.id);
            if (i.alumnoId == alumno_id) {
                io.to(i.socket.id).emit('pago_validado', {msg: 'Todo bien con tu pago'})
                return
            }

        })
    }

    res.status(200).send('Todo bien')
});
app.get('/sin_cupo_materia', function (req, res) {
    let {horario_materia_id, plan_id} = req.query;
    //console.log(AlumnoManager.ALUMNOS_PLANES[plan_id]);
    if (horario_materia_id && plan_id && AlumnoManager.ALUMNOS_PLANES[plan_id]) {
        AlumnoManager.ALUMNOS_PLANES[plan_id].forEach((i) => {
            io.to(i.socket.id).emit('sin_cupo_materia', {msg: horario_materia_id})
        })
    }

    res.status(200).send('Todo bien')
});


http.listen(PORT, function () {
    console.log('listening on *:' + PORT);
});
