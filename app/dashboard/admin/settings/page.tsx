 'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/ui/card'
import { Button } from '@/app/ui/button'
import { Input } from '@/app/ui/input'
import { Label } from '@/app/ui/label'
import { Switch } from '@/app/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/ui/tabs'
import { Save, Shield, Bell, Database, Users, Globe } from 'lucide-react'

export default function SettingsPage() {
  const [generalSettings, setGeneralSettings] = useState({
    systemName: 'DrugChain Inventory Management',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    language: 'English',
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    sessionTimeout: '30',
    passwordPolicy: 'strong',
    ipWhitelist: false,
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    lowStockAlerts: true,
    expiryWarnings: true,
    orderUpdates: true,
    systemAlerts: true,
  })

  const [systemSettings, setSystemSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    dataRetention: '90',
    maintenanceMode: false,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Configure system settings and preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general" className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <span>General</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span>System</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="systemName">System Name</Label>
                  <Input
                    id="systemName"
                    value={generalSettings.systemName}
                    onChange={(e) => setGeneralSettings({
                      ...generalSettings,
                      systemName: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={generalSettings.timezone}
                    onValueChange={(value) => setGeneralSettings({
                      ...generalSettings,
                      timezone: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Time</SelectItem>
                      <SelectItem value="PST">Pacific Time</SelectItem>
                      <SelectItem value="GMT">GMT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select
                    value={generalSettings.dateFormat}
                    onValueChange={(value) => setGeneralSettings({
                      ...generalSettings,
                      dateFormat: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={generalSettings.language}
                    onValueChange={(value) => setGeneralSettings({
                      ...generalSettings,
                      language: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Require 2FA for all users
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) => setSecuritySettings({
                      ...securitySettings,
                      twoFactorAuth: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>IP Whitelist</Label>
                    <p className="text-sm text-muted-foreground">
                      Restrict access to specific IP addresses
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.ipWhitelist}
                    onCheckedChange={(checked) => setSecuritySettings({
                      ...securitySettings,
                      ipWhitelist: checked
                    })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Select
                      value={securitySettings.sessionTimeout}
                      onValueChange={(value) => setSecuritySettings({
                        ...securitySettings,
                        sessionTimeout: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passwordPolicy">Password Policy</Label>
                    <Select
                      value={securitySettings.passwordPolicy}
                      onValueChange={(value) => setSecuritySettings({
                        ...securitySettings,
                        passwordPolicy: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="strong">Strong</SelectItem>
                        <SelectItem value="very-strong">Very Strong</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({
                      ...notificationSettings,
                      emailNotifications: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send notifications via SMS
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({
                      ...notificationSettings,
                      smsNotifications: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Low Stock Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when inventory is low
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.lowStockAlerts}
                    onCheckedChange={(checked) => setNotificationSettings({
                      ...notificationSettings,
                      lowStockAlerts: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Expiry Warnings</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify before drugs expire
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.expiryWarnings}
                    onCheckedChange={(checked) => setNotificationSettings({
                      ...notificationSettings,
                      expiryWarnings: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Order Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify on order status changes
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.orderUpdates}
                    onCheckedChange={(checked) => setNotificationSettings({
                      ...notificationSettings,
                      orderUpdates: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>System Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify on system issues
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.systemAlerts}
                    onCheckedChange={(checked) => setNotificationSettings({
                      ...notificationSettings,
                      systemAlerts: checked
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Backup</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically backup system data
                    </p>
                  </div>
                  <Switch
                    checked={systemSettings.autoBackup}
                    onCheckedChange={(checked) => setSystemSettings({
                      ...systemSettings,
                      autoBackup: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Put system in maintenance mode
                    </p>
                  </div>
                  <Switch
                    checked={systemSettings.maintenanceMode}
                    onCheckedChange={(checked) => setSystemSettings({
                      ...systemSettings,
                      maintenanceMode: checked
                    })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="backupFrequency">Backup Frequency</Label>
                    <Select
                      value={systemSettings.backupFrequency}
                      onValueChange={(value) => setSystemSettings({
                        ...systemSettings,
                        backupFrequency: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dataRetention">Data Retention (days)</Label>
                    <Select
                      value={systemSettings.dataRetention}
                      onValueChange={(value) => setSystemSettings({
                        ...systemSettings,
                        dataRetention: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2">
        <Button variant="outline">Reset to Defaults</Button>
        <Button className="flex items-center space-x-2">
          <Save className="h-4 w-4" />
          <span>Save Changes</span>
        </Button>
      </div>
    </div>
  )
}