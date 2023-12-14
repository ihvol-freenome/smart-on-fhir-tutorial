(function(window){
  window.extractData = function() {
    var ret = $.Deferred();

    function onError() {
      console.log('Loading error', arguments);
      ret.reject();
    }

    function onReady(smart)  {
      console.log('fetching patient data...');
      if (smart.hasOwnProperty('patient')) {
        var patient = smart.patient;
        var pt = patient.read();
        var obv = smart.patient.api.fetchAll({
                    type: 'Observation',
                    //type: 'Procedure',
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
                              'http://loinc.org|82688-3',
                              'http://loinc.org|396226005',
                              'http://loinc.org|425634007',
                              'http://loinc.org|44441009',
                              'http://loinc.org|45330',
                              'http://loinc.org|45331',
                              'http://loinc.org|45332',
                              'http://loinc.org|45333',
                              'http://loinc.org|45334',
                              'http://loinc.org|45335',
                              'http://loinc.org|45337',
                              'http://loinc.org|45338',
                              'http://loinc.org|45340',
                              'http://loinc.org|45341',
                              'http://loinc.org|45342',
                              'http://loinc.org|45346',
                              'http://loinc.org|45347',
                              'http://loinc.org|45349',
                              'http://loinc.org|45350',
                              'http://loinc.org|841000119107',
                              'http://loinc.org|G0104',
                              'http://loinc.org|1209098000',
                              'http://loinc.org|12350003',
                              'http://loinc.org|174158000',
                              'http://loinc.org|174185007',
                              'http://loinc.org|235150006',
                              'http://loinc.org|235151005',
                              'http://loinc.org|25732003',
                              'http://loinc.org|275251008',
                              'http://loinc.org|302052009',
                              'http://loinc.org|34264006',
                              'http://loinc.org|367535003',
                              'http://loinc.org|44388',
                              'http://loinc.org|44389',
                              'http://loinc.org|44390',
                              'http://loinc.org|44391',
                              'http://loinc.org|44392',
                              'http://loinc.org|44393',
                              'http://loinc.org|44394',
                              'http://loinc.org|44397',
                              'http://loinc.org|443998000',
                              'http://loinc.org|44401',
                              'http://loinc.org|44402',
                              'http://loinc.org|44403',
                              'http://loinc.org|44404',
                              'http://loinc.org|44405',
                              'http://loinc.org|44406',
                              'http://loinc.org|44407',
                              'http://loinc.org|44408',
                              'http://loinc.org|444783004',
                              'http://loinc.org|446521004',
                              'http://loinc.org|446745002',
                              'http://loinc.org|447021001',
                              'http://loinc.org|45355',
                              'http://loinc.org|45378',
                              'http://loinc.org|45379',
                              'http://loinc.org|45380',
                              'http://loinc.org|45381',
                              'http://loinc.org|45382',
                              'http://loinc.org|45383',
                              'http://loinc.org|45384',
                              'http://loinc.org|45385',
                              'http://loinc.org|45386',
                              'http://loinc.org|45387',
                              'http://loinc.org|45388',
                              'http://loinc.org|45389',
                              'http://loinc.org|45390',
                              'http://loinc.org|45391',
                              'http://loinc.org|45392',
                              'http://loinc.org|45393',
                              'http://loinc.org|45398',
                              'http://loinc.org|709421007',
                              'http://loinc.org|710293001',
                              'http://loinc.org|711307001',
                              'http://loinc.org|713154003',
                              'http://loinc.org|73761001',
                              'http://loinc.org|8180007',
                              'http://loinc.org|851000119109',
                              'http://loinc.org|G0105',
                              'http://loinc.org|G0121']
                      }
                    }
                  });

        $.when(pt, obv).fail(onError);

        $.when(pt, obv).done(function(patient, obv) {
          //createTable(obv)
          console.log('loaded patient data...');

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
            '396226005',
            '425634007',
            '44441009',
            '45330',
            '45331',
            '45332',
            '45333',
            '45334',
            '45335',
            '45337',
            '45338',
            '45340',
            '45341',
            '45342',
            '45346',
            '45347',
            '45349',
            '45350',
            '841000119107',
            'G0104',
            '1209098000',
            '12350003',
            '174158000',
            '174185007',
            '235150006',
            '235151005',
            '25732003',
            '275251008',
            '302052009',
            '34264006',
            '367535003',
            '44388',
            '44389',
            '44390',
            '44391',
            '44392',
            '44393',
            '44394',
            '44397',
            '443998000',
            '44401',
            '44402',
            '44403',
            '44404',
            '44405',
            '44406',
            '44407',
            '44408',
            '444783004',
            '446521004',
            '446745002',
            '447021001',
            '45355',
            '45378',
            '45379',
            '45380',
            '45381',
            '45382',
            '45383',
            '45384',
            '45385',
            '45386',
            '45387',
            '45388',
            '45389',
            '45390',
            '45391',
            '45392',
            '45393',
            '45398',
            '709421007',
            '710293001',
            '711307001',
            '713154003',
            '73761001',
            '8180007',
            '851000119109',
            'G0105',
            'G0121',
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
          console.log('rendered patient data...');

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
