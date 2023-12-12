(function(window){
  window.extractData = function() {
    var ret = $.Deferred();

    function onError() {
      console.log('Loading error', arguments);
      ret.reject();
    }

    function onReady(smart)  {
      if (smart.hasOwnProperty('patient')) {
        var patient = smart.patient;
        var pt = patient.read();
        var obv = smart.patient.api.fetchAll({
                    type: 'Observation',
                    query: {
                      code: {
                        $or: ['http://loinc.org|8302-2', 'http://loinc.org|8462-4',
                              'http://loinc.org|8480-6', 'http://loinc.org|2085-9',
                              'http://loinc.org|2089-1', 'http://loinc.org|55284-4',
                              'http://loinc.org|18746-8',
                              'http://loinc.org|77353-1',
                              'http://loinc.org|77354-9',
                              'http://loinc.org|12503-9',
                              'http://loinc.org|12504-7',
                              'http://loinc.org|14563-1',
                              'http://loinc.org|14564-9',
                              'http://loinc.org|14565-6',
                              'http://loinc.org|2335-8',
                              'http://loinc.org|27396-1',
                              'http://loinc.org|27401-9',
                              'http://loinc.org|27925-7',
                              'http://loinc.org|27926-5',
                              'http://loinc.org|29771-3',
                              'http://loinc.org|56490-6',
                              'http://loinc.org|56491-4',
                              'http://loinc.org|57905-2',
                              'http://loinc.org|58453-2',
                              'http://loinc.org|80372-6',
                              'http://loinc.org|60515-4',
                              'http://loinc.org|72531-7',
                              'http://loinc.org|79069-1',
                              'http://loinc.org|79071-7',
                              'http://loinc.org|79101-2',
                              'http://loinc.org|82688-3']
                      }
                    }
                  });

        $.when(pt, obv).fail(onError);

        $.when(pt, obv).done(function(patient, obv) {
          //createTable(obv)

          var byCodes = smart.byCodes(obv, 'code');
          var gender = patient.gender;

          var fname = '';
          var lname = '';

          if (typeof patient.name[0] !== 'undefined') {
            fname = patient.name[0].given.join(' ');
            lname = patient.name[0].family.join(' ');
          }

          var height = byCodes('8302-2');
          var systolicbp = getBloodPressureValue(byCodes('55284-4'),'8480-6');
          var diastolicbp = getBloodPressureValue(byCodes('55284-4'),'8462-4');
          var hdl = byCodes('2085-9');
          var ldl = byCodes('2089-1');

          var p = defaultPatient();
          p.birthdate = patient.birthDate;
          p.gender = gender;
          p.fname = fname;
          p.lname = lname;
          p.height = getQuantityValueAndUnit(height[0]);

          if (typeof systolicbp != 'undefined')  {
            p.systolicbp = systolicbp;
          }

          if (typeof diastolicbp != 'undefined') {
            p.diastolicbp = diastolicbp;
          }

          p.hdl = getQuantityValueAndUnit(hdl[0]);
          p.ldl = getQuantityValueAndUnit(ldl[0]);

          var crc_codes = [
            '77353-1',
            '77354-9',
            '12503-9',
            '12504-7',
            '14563-1',
            '14564-9',
            '14565-6',
            '2335-8',
            '27396-1',
            '27401-9',
            '27925-7',
            '27926-5',
            '29771-3',
            '56490-6',
            '56491-4',
            '57905-2',
            '58453-2',
            '80372-6',
            '60515-4',
            '72531-7',
            '79069-1',
            '79071-7',
            '79101-2',
            '82688-3'
          ]
          for (let i = 0; i < crc_codes.length; i++) {
            data = byCodes(crc_codes[i]);
            if (data === undefined || data.length == 0) {
                console.log(data);
                continue;
            }
            p.data = JSON.stringify(data);
          }
          //p.data = JSON.stringify(byCodes('18746-8'));
          //18746-8

          ret.resolve(p);
        });
      } else {
        onError();
      }
    }

    FHIR.oauth2.ready(onReady, onError);
    return ret.promise();

  };

  function createTable(tableData) {
    var table = document.createElement('table');
    var tableBody = document.createElement('tbody');

    tableData.forEach(function(rowData) {
      var row = document.createElement('tr');

      rowData.forEach(function(cellData) {
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode(cellData));
        row.appendChild(cell);
      });

      tableBody.appendChild(row);
    });

    table.appendChild(tableBody);
    document.body.appendChild(table);
  }

  function defaultPatient(){
    return {
      fname: {value: ''},
      lname: {value: ''},
      gender: {value: ''},
      birthdate: {value: ''},
      height: {value: ''},
      systolicbp: {value: ''},
      diastolicbp: {value: ''},
      ldl: {value: ''},
      hdl: {value: ''},
      data: {value: ''},
    };
  }

  function getBloodPressureValue(BPObservations, typeOfPressure) {
    var formattedBPObservations = [];
    BPObservations.forEach(function(observation){
      var BP = observation.component.find(function(component){
        return component.code.coding.find(function(coding) {
          return coding.code == typeOfPressure;
        });
      });
      if (BP) {
        observation.valueQuantity = BP.valueQuantity;
        formattedBPObservations.push(observation);
      }
    });

    return getQuantityValueAndUnit(formattedBPObservations[0]);
  }

  function getQuantityValueAndUnit(ob) {
    if (typeof ob != 'undefined' &&
        typeof ob.valueQuantity != 'undefined' &&
        typeof ob.valueQuantity.value != 'undefined' &&
        typeof ob.valueQuantity.unit != 'undefined') {
          return ob.valueQuantity.value + ' ' + ob.valueQuantity.unit;
    } else {
      return undefined;
    }
  }

  window.drawVisualization = function(p) {
    $('#holder').show();
    $('#loading').hide();
    $('#fname').html(p.fname);
    $('#lname').html(p.lname);
    $('#gender').html(p.gender);
    $('#birthdate').html(p.birthdate);
    $('#height').html(p.height);
    $('#systolicbp').html(p.systolicbp);
    $('#diastolicbp').html(p.diastolicbp);
    $('#ldl').html(p.ldl);
    $('#hdl').html(p.hdl);
    $('#data').html(p.data);
  };

})(window);
