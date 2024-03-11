
import { User } from '../entities/User.entity';
import { Subject } from '../entities/Subject.entity';
import { Evidence, FormatFile } from '../entities/Evidence.entity';
import { postgresDataSource } from '../postgres-databse';
import { bcryptAdapter } from '../../../config';


(async()=> {
    await  postgresDataSource.initialize();
    await clearData();
    await main();
    await postgresDataSource.destroy()
  })();
  

async function main() {
    try {
        
       const userData = [
        { name: 'Juan', lastname: 'Pérez', email: 'juan@example.com', identification: '12345678A', phone: '123456789', password:  bcryptAdapter.hash('password1') , birthdate: new Date('1990-01-01'), active: true },
        { name: 'María', lastname: 'García', email: 'maria@example.com', identification: '87654321B', phone: '987654321', password: bcryptAdapter.hash('password2') , birthdate: new Date('1995-05-15'), active: true },
        ];

       await postgresDataSource.manager.save(User, userData);

        const subjectData = [
            { name: 'Mathematics', period: '2023', active: true },
            { name: 'Science', period: '2023', active: true},
        ];

        await postgresDataSource.manager.save(Subject, subjectData);
   
        const evidenceData = [
            { filename: 'evidence1.pdf', size: 1024, format:  FormatFile.JPEG, active: true},
            { filename: 'evidence2.jpg', size: 2048, format:  FormatFile.JPEG, active: true}
        ];

        await postgresDataSource.manager.save(Evidence, evidenceData);
           

        console.log('Datos insertados correctamente.');

    } catch (error) {
        console.error('Error al ejecutar el script:', error);
    }
}

async function clearData() {
    await postgresDataSource.manager.delete('user_subject', {});
    await postgresDataSource.manager.delete(Evidence, {});
    await postgresDataSource.manager.delete(User, {});
    await postgresDataSource.manager.delete(Subject, {});
    console.log('Datos eliminados correctamente.');
}

