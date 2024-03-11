
import { bcryptAdapter } from '../config';
import { User, UserRole, postgresDataSource } from '../data';


export async function createAdminUser() {
    try {
        const adminUser = await postgresDataSource.manager.findOne(User, { where: { role: UserRole.ADMIN } });

        if (!adminUser) {
            const adminUserData = {
                name: 'Admin',
                lastname: 'Admin',
                email: 'admin@example.com',
                identification: '0000000000',
                phone: '123456789',
                password: bcryptAdapter.hash('adminPassword'),
                birthdate: new Date('1990-01-01'),
                active: true,
                role: UserRole.ADMIN
            };

            await postgresDataSource.manager.save(User, adminUserData);
            console.log('Usuario administrador creado con éxito.');
        } else {
            console.log('Ya existe un usuario administrador en la base de datos.');
        }
    } catch (error) {
        console.error('Error al crear el usuario administrador:', error);
    }
}