import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Staff } from '../types';

export const generateStaffReport = async (staffList: Staff[], t: (key: string) => string): Promise<void> => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text(t('staffDatabaseTitle'), 14, 22);
    
    const sortedList = [...staffList].sort((a, b) => a.apellidos.localeCompare(b.apellidos));

    let startY = 30;

    sortedList.forEach(staff => {
        const finalY = (doc as any).lastAutoTable.finalY || startY;
        if (finalY > 250) { // Check if we need a new page
             doc.addPage();
             startY = 22;
        } else {
            startY = finalY + 10;
        }

        doc.setFontSize(14);
        doc.text(staff.nombreCompleto, 14, startY);

        const tableData = [
            [t('id'), staff.id],
            [t('nationality'), staff.nacionalidad],
            [t('employeeDUI'), staff.dui],
            [t('pjRole'), staff.rolDePj],
            [t('jobPosition'), staff.puestoDeTrabajo],
            [t('birthDate'), staff.fechaNacimiento],
            [t('phone'), staff.telefono],
            [t('email'), staff.email],
            [t('monthlySalary'), staff.salarioMensual ? `$${staff.salarioMensual}` : ''],
            [t('afp'), staff.afp],
            [t('afpNumber'), staff.numeroAfp],
            [t('isssNumber'), staff.numeroIsss],
            [t('passport'), staff.pasaporte],
            [t('specialty'), staff.especialidad.join(', ')],
            [t('yearsOfExperience'), staff.anosExperiencia],
            [t('contactPerson'), staff.personaContacto],
            [t('contactPhone'), staff.telefonoContacto],
            [t('isAllergic'), t(staff.esAlergico || 'no')],
            [t('allergyDetails'), staff.detalleAlergias],
            [t('yellowFeverVaccine'), t(staff.vacunaFiebreAmarilla || 'no')],
            [t('isDriver'), t(staff.esConductor || 'no')],
            [t('driverLicense'), staff.licenciaConducir],
            [t('hasTrainings'), staff.trainings.map(tr => `${tr.nombreCurso} (${tr.nivel})`).join('; ')],
        ];

        autoTable(doc, {
            body: tableData.filter(row => row[1]), // Only show rows with data
            startY: startY + 5,
            theme: 'plain',
            styles: { fontSize: 9 },
            columnStyles: {
                0: { fontStyle: 'bold', cellWidth: 50 },
                1: { cellWidth: 'auto' }
            }
        });
    });
    
    doc.save(`Telecor_Staff_Report_${new Date().toISOString().slice(0,10)}.pdf`);
};
