import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Project, Resource } from '../types';
import { formatCurrency } from '../utils/formatting';

interface ReportRow {
    project: Project;
    resource: Resource;
}

export interface ReportFilters {
    clients: string[];
    projectNames: string[];
    statuses: string[];
    staffNames: string[];
}

export const generateReport = async (projects: Project[], t: (key: string) => string, filters: ReportFilters): Promise<void> => {
    const doc = new jsPDF({ orientation: 'landscape' });
    
    doc.setFontSize(18);
    doc.text(t('appTitle'), 14, 22);
    doc.setFontSize(11);

    const filteredProjects = projects.filter(p => {
        const clientMatch = filters.clients.length === 0 || filters.clients.includes(p['ID Cliente']);
        const nameMatch = filters.projectNames.length === 0 || filters.projectNames.includes(p['Nombre del Proyecto']);
        const statusMatch = filters.statuses.length === 0 || filters.statuses.includes(p['Status del Proyecto']);
        const staffMatch = filters.staffNames.length === 0 || p.resources.some(r => filters.staffNames.includes(r['Nombre Completo Staff']));
        return clientMatch && nameMatch && statusMatch && staffMatch;
    });


    const tableColumn = [
        t('projectName'),
        t('client'),
        t('status'),
        t('staffFullName'),
        t('staffRole'),
        t('reportResourceStartDate'),
        t('reportResourceEndDate'),
        t('workingDays'),
        t('monthlySalary'),
        t('reportAmountToPay')
    ];
    
    const tableRows: (string|number)[][] = [];
    let grandTotal = 0;

    filteredProjects.forEach(project => {
        let resourcesToDisplay = project.resources;
        if(filters.staffNames.length > 0) {
            resourcesToDisplay = project.resources.filter(r => filters.staffNames.includes(r['Nombre Completo Staff']));
        }
        
        if (resourcesToDisplay.length === 0 && filters.staffNames.length > 0) return;

        if (resourcesToDisplay.length > 0) {
            resourcesToDisplay.forEach(resource => {
                 const resourceData = [
                    project['Nombre del Proyecto'],
                    project['ID Cliente'],
                    t(`status${project['Status del Proyecto'].replace(' ', '')}`),
                    resource['Nombre Completo Staff'],
                    resource['Rol Staff'],
                    resource['Fecha Inicio'],
                    resource['Fecha Fin'],
                    resource['Dias Laborados'],
                    formatCurrency(resource['Salario Mensual']),
                    formatCurrency(resource['Monto a pagar por Dias'])
                ];
                tableRows.push(resourceData);
                grandTotal += resource['Monto a pagar por Dias'];
            });
        } else { // Display project info even if no resources match (or no resources assigned)
             const projectData = [
                project['Nombre del Proyecto'],
                project['ID Cliente'],
                t(`status${project['Status del Proyecto'].replace(' ', '')}`),
                '-', '-', '-', '-', '-', '-', '-'
             ];
             tableRows.push(projectData);
        }
    });

    if(tableRows.length > 0) {
        const totalRow = [
            { content: t('total'), colSpan: 9, styles: { halign: 'right', fontStyle: 'bold' } },
            { content: formatCurrency(grandTotal), styles: { fontStyle: 'bold' } }
        ];
        tableRows.push(totalRow as any);
    } else {
        tableRows.push([{content: "No data matches the selected filters.", colSpan: 10, styles: {halign: 'center'}} as any]);
    }


    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 30,
        theme: 'striped',
        headStyles: { fillColor: [22, 160, 133] },
    });
    
    doc.save(`Telecor_Report_${new Date().toISOString().slice(0,10)}.pdf`);
};
