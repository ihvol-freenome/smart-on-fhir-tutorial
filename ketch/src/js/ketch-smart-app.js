(function(window) {
    window.extractData = function() {
        var ret = $.Deferred();

        function onError() {
            console.log('Loading error', arguments);
            ret.reject();
        }

        function onReady(smart) {
            console.log('fetching patient data...');

            var crc_codes = ['396226005', '425634007', '44441009', '45330', '45331', '45332', '45333',
                '45334', '45335', '45337', '45338', '45340', '45341', '45342', '45346', '45347',
                '45349', '45350', '841000119107', 'G0104', '1209098000', '12350003', '174158000',
                '174185007', '235150006', '235151005', '25732003', '275251008', '302052009',
                '34264006', '367535003', '44388', '44389', '44390', '44391', '44392', '44393',
                '44394', '44397', '443998000', '44401', '44402', '44403', '44404', '44405',
                '44406', '44407', '44408', '444783004', '446521004', '446745002', '447021001',
                '45355', '45378', '45379', '45380', '45381', '45382', '45383', '45384', '45385',
                '45386', '45387', '45388', '45389', '45390', '45391', '45392', '45393', '45398',
                '709421007', '710293001', '711307001', '713154003', '73761001', '8180007',
                '851000119109', 'G0105', 'G0121', '77353-1', '77354-9', '12503-9', '12504-7',
                '14563-1', '14564-9', '14565-6', '2335-8', '27396-1', '27401-9', '27925-7',
                '27926-5', '29771-3', '56490-6', '56491-4', '57905-2', '58453-2', '80372-6',
                '60515-4', '72531-7', '79069-1', '79071-7', '79101-2', '82688-3'
            ];
            crc_codes.push.apply(crc_codes, ['8302-2','8480-6', '8462-4', '2085-9','55284-4', '2089-1']);

            // Concatenate the string to each item in the array
            var crc_codes_urls = crc_codes.map(function(item) {
                return 'http://loinc.org|' + item;
            });
            console.log(crc_codes_urls);

            if (smart.hasOwnProperty('patient')) {
                var patient = smart.patient;
                var pt = patient.read();
                var obv = smart.patient.api.fetchAll({
                    type: 'Observation',
                    //type: 'Procedure',
                    query: {
                        code: {
                            $or: crc_codes_urls
                        }
                    }
                });
                $.when(pt, obv).fail(onError);
                $.when(pt, obv).done(function(patient, obv) {
                    console.log('loaded patient data...');
                    console.log(obv);
                    var byCodes = smart.byCodes(obv, 'code');
                    var gender = patient.gender;
                    var fname = '';
                    var lname = '';
                    if (typeof patient.name[0] !== 'undefined') {
                        fname = patient.name[0].given.join(' ');
                        lname = patient.name[0].family.join(' ');
                    }
                    var height = byCodes('8302-2');
                    var systolicbp = getBloodPressureValue(byCodes('55284-4'), '8480-6');
                    var diastolicbp = getBloodPressureValue(byCodes('55284-4'), '8462-4');
                    var hdl = byCodes('2085-9');
                    var ldl = byCodes('2089-1');
                    var p = defaultPatient();
                    p.birthdate = patient.birthDate;
                    p.gender = gender;
                    p.fname = fname;
                    p.lname = lname;
                    p.height = getQuantityValueAndUnit(height[0]);
                    if (typeof systolicbp != 'undefined') {
                        p.systolicbp = systolicbp;
                    }
                    if (typeof diastolicbp != 'undefined') {
                        p.diastolicbp = diastolicbp;
                    }
                    p.hdl = getQuantityValueAndUnit(hdl[0]);
                    p.ldl = getQuantityValueAndUnit(ldl[0]);
                    for (let i = 0; i < crc_codes.length; i++) {
                        data = byCodes(crc_codes[i]);
                        if (data === undefined || data.length == 0) {
                            continue;
                        }
                        p.data = data;
                    }
                    //p.data = JSON.stringify(byCodes('18746-8'));
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

    function displayObservations(observationData) {
        let observationsHTML = '';
        observationData.forEach(observation => {
            observationsHTML += `
                <div class="observation">
                    <div class="observation-header">${observation.code.coding[0].display}</div>
                    <div class="observation-details">
                        <p><strong>Code:</strong> ${observation.code.coding[0].code}</p>
                        <p><strong>Category:</strong> ${observation.category.coding[0].code}</p>
                        <p><strong>Subject Reference:</strong> ${observation.subject.reference}</p>
                        <p><strong>Encounter Reference:</strong> ${observation.encounter.reference}</p>
                        <p><strong>Effective DateTime:</strong> ${observation.effectiveDateTime}</p>
                        <p><strong>Status:</strong> ${observation.status}</p>
                        ${Object.hasOwnProperty(observation.issued) ? `<p><strong>Issued:</strong> ${observation.issued}</p>` : ''}
                        ${Object.hasOwnProperty(observation.valueQuantity) ? `<p><strong>Value:</strong> ${observation.valueQuantity.value} ${observation.valueQuantity.unit}</p>` : ''}
                        ${Object.hasOwnProperty(observation.id) ? `<p><strong>Issd:</strong> ${observation.id}</p>` : ''}
                        <p><strong>ID:</strong> ${observation.id}</p>
                    </div>
                </div>
            `;
        });
        //<p><strong>Identifier:</strong> ${observation.identifier[0].value}</p>
        //<p><strong>Value:</strong> ${observation.valueQuantity.value} ${observation.valueQuantity.unit}</p>
        document.getElementById('observationsData').innerHTML = observationsHTML;
    }

    function defaultPatient() {
        return {
            fname: {
                value: ''
            },
            lname: {
                value: ''
            },
            gender: {
                value: ''
            },
            birthdate: {
                value: ''
            },
            height: {
                value: ''
            },
            systolicbp: {
                value: ''
            },
            diastolicbp: {
                value: ''
            },
            ldl: {
                value: ''
            },
            hdl: {
                value: ''
            },
            data: {
                value: ''
            },
        };
    }

    function getBloodPressureValue(BPObservations, typeOfPressure) {
        var formattedBPObservations = [];
        BPObservations.forEach(function(observation) {
            var BP = observation.component.find(function(component) {
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
        if (typeof ob != 'undefined' && typeof ob.valueQuantity != 'undefined' && typeof ob.valueQuantity
            .value != 'undefined' && typeof ob.valueQuantity.unit != 'undefined') {
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
        //$('#data').html(JSON.stringify(p.data));
        displayObservations(p.data);
    };
})(window);
