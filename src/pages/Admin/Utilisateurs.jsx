import { useState, useMemo } from 'react'
import { Header, Sidebar } from '../../components/Layout'
import { Card, Table, Badge, Button, Input, Select, Modal } from '../../components/UI'
import { useData } from '../../contexts/DataContext'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useToast } from '../../components/UI/Toast'
import { 
  Plus, Edit, Trash2, Shield, UserCog, Users, Eye, EyeOff,
  CheckCircle, XCircle, Key
} from 'lucide-react'

const AdminUtilisateurs = () => {
  const { users, addUser, updateUser, deleteUser } = useData()
  const { user: currentUser } = useAuth()
  const { t } = useLanguage()
  const { showToast, ToastContainer } = useToast()

  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    roleAdmin: 'employee', // admin, officer, employee
    statut: 'actif'
  })

  // Filtrer les utilisateurs admin
  const adminUsers = useMemo(() => {
    return users.filter(u => u.role === 'admin' || u.roleAdmin)
  }, [users])

  // Descriptions des rôles
  const roleDescriptions = {
    admin: {
      label: 'Administrateur',
      color: 'danger',
      icon: Shield,
      permissions: [
        t('admin.fullAccess'),
        t('admin.manageUsers'),
        t('admin.grantAccess'),
        t('admin.allFeatures')
      ]
    },
    officer: {
      label: 'Officer',
      color: 'warning',
      icon: UserCog,
      permissions: [
        t('admin.publishOffers'),
        t('admin.manageApplications'),
        t('admin.viewProfiles'),
        t('admin.messaging')
      ]
    },
    employee: {
      label: 'Employé',
      color: 'info',
      icon: Users,
      permissions: [
        t('admin.createProfiles'),
        t('admin.updateProfiles'),
        t('admin.uploadCV'),
        t('admin.viewOnly')
      ]
    }
  }

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%'
    let password = ''
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData({ ...formData, password })
  }

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user)
      setFormData({
        nom: user.nom || '',
        prenom: user.prenom || '',
        email: user.email || '',
        password: '',
        roleAdmin: user.roleAdmin || 'employee',
        statut: user.statut || 'actif'
      })
    } else {
      setEditingUser(null)
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        password: '',
        roleAdmin: 'employee',
        statut: 'actif'
      })
    }
    setShowModal(true)
  }

  const handleSubmit = () => {
    if (!formData.nom || !formData.prenom || !formData.email) {
      showToast(t('admin.fillRequiredFields'), 'error')
      return
    }

    if (!editingUser && !formData.password) {
      showToast(t('admin.passwordRequired'), 'error')
      return
    }

    if (editingUser) {
      const updates = { ...formData }
      if (!updates.password) delete updates.password
      updateUser(editingUser.id, updates)
      showToast(t('admin.userUpdated'), 'success')
    } else {
      addUser({
        ...formData,
        id: 'admin-' + Date.now().toString(),
        role: 'admin',
        createdAt: new Date().toISOString()
      })
      showToast(t('admin.userCreated'), 'success')
    }
    setShowModal(false)
  }

  const handleDelete = (userId) => {
    if (userId === currentUser?.id) {
      showToast(t('admin.cannotDeleteSelf'), 'error')
      return
    }
    if (window.confirm(t('admin.confirmDelete'))) {
      deleteUser(userId)
      showToast(t('admin.userDeleted'), 'success')
    }
  }

  const columns = [
    { 
      header: t('admin.name'), 
      accessor: 'nom', 
      render: (nom, row) => {
        const RoleIcon = roleDescriptions[row.roleAdmin]?.icon || Shield
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold-500/20 rounded-full flex items-center justify-center">
              <RoleIcon className="w-5 h-5 text-gold-500" />
            </div>
            <div>
              <p className="font-medium text-gray-100">{row.prenom} {nom}</p>
              <p className="text-sm text-gray-400">{row.email}</p>
            </div>
          </div>
        )
      }
    },
    { 
      header: t('admin.role'), 
      accessor: 'roleAdmin',
      render: (roleAdmin) => {
        const role = roleDescriptions[roleAdmin] || roleDescriptions.employee
        return <Badge variant={role.color}>{role.label}</Badge>
      }
    },
    { 
      header: t('admin.status'), 
      accessor: 'statut',
      render: (statut) => (
        <Badge variant={statut === 'actif' ? 'success' : 'danger'}>
          {statut === 'actif' ? t('admin.active') : t('admin.inactive')}
        </Badge>
      )
    },
    { 
      header: t('admin.createdAt'), 
      accessor: 'createdAt', 
      render: (date) => date ? new Date(date).toLocaleDateString('fr-FR') : 'N/A' 
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (id, row) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleOpenModal(row)}>
            <Edit className="w-4 h-4" />
          </Button>
          {id !== currentUser?.id && (
            <Button variant="danger" size="sm" onClick={() => handleDelete(id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      )
    }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-navy-900">
      <Header />
      <div className="flex flex-1">
        <Sidebar role="admin" />
        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-display font-bold text-gray-100">{t('admin.usersManagement')}</h1>
            <Button variant="gold" onClick={() => handleOpenModal()}>
              <Plus className="w-4 h-4 mr-2" />
              {t('admin.addUser')}
            </Button>
          </div>

          {/* Légende des rôles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {Object.entries(roleDescriptions).map(([key, role]) => {
              const Icon = role.icon
              return (
                <Card key={key} className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      key === 'admin' ? 'bg-red-500/20' : 
                      key === 'officer' ? 'bg-amber-500/20' : 'bg-blue-500/20'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        key === 'admin' ? 'text-red-400' : 
                        key === 'officer' ? 'text-amber-400' : 'text-blue-400'
                      }`} />
                    </div>
                    <Badge variant={role.color}>{role.label}</Badge>
                  </div>
                  <ul className="space-y-1">
                    {role.permissions.map((perm, i) => (
                      <li key={i} className="text-sm text-gray-400 flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        {perm}
                      </li>
                    ))}
                  </ul>
                </Card>
              )
            })}
          </div>

          <Card>
            {adminUsers.length === 0 ? (
              <p className="text-center text-gray-400 py-8">{t('admin.noUsers')}</p>
            ) : (
              <Table columns={columns} data={adminUsers} />
            )}
          </Card>
        </main>
      </div>

      {/* Modal Ajout/Edition */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingUser ? t('admin.editUser') : t('admin.newUser')}
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="gold" onClick={handleSubmit}>
              {t('common.save')}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label={t('admin.firstName') + ' *'}
              value={formData.prenom}
              onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
              required
            />
            <Input
              label={t('admin.lastName') + ' *'}
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              required
            />
          </div>

          <Input
            label={t('admin.email') + ' *'}
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                label={t('admin.password') + (editingUser ? '' : ' *')}
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder={editingUser ? t('admin.leaveEmptyToKeep') : ''}
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowPassword(!showPassword)}
              className="mt-6"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
            <Button 
              variant="outline" 
              onClick={generatePassword}
              className="mt-6"
            >
              <Key className="w-4 h-4" />
            </Button>
          </div>

          <Select
            label={t('admin.adminRole') + ' *'}
            value={formData.roleAdmin}
            onChange={(e) => setFormData({ ...formData, roleAdmin: e.target.value })}
            options={[
              { value: 'admin', label: '🛡️ Administrateur - Accès complet' },
              { value: 'officer', label: '⚙️ Officer - Publication offres' },
              { value: 'employee', label: '👤 Employé - Gestion profils & CV' }
            ]}
          />

          {/* Description du rôle sélectionné */}
          <div className="p-4 bg-navy-800 rounded-lg">
            <p className="text-sm font-medium text-gray-300 mb-2">
              {t('admin.rolePermissions')} :
            </p>
            <ul className="space-y-1">
              {roleDescriptions[formData.roleAdmin]?.permissions.map((perm, i) => (
                <li key={i} className="text-sm text-gray-400 flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  {perm}
                </li>
              ))}
            </ul>
          </div>

          <Select
            label={t('admin.status')}
            value={formData.statut}
            onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
            options={[
              { value: 'actif', label: t('admin.active') },
              { value: 'inactif', label: t('admin.inactive') }
            ]}
          />
        </div>
      </Modal>

      <ToastContainer />
    </div>
  )
}

export default AdminUtilisateurs
