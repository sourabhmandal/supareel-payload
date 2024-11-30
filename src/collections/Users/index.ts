import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email', 'role'],
    listSearchableFields: ['name', 'email'],
    useAsTitle: 'name',
    pagination: {
      defaultLimit: 10,
      limits: [10, 20, 50],
    },
  },
  auth: {
    tokenExpiration: 7200, // How many seconds to keep the user logged in
    verify: true, // Require email verification before being allowed to authenticate
    maxLoginAttempts: 5, // Automatically lock a user out after X amount of failed logins
    lockTime: 600 * 1000, // Time period to allow the max login attempts
    loginWithUsername: false,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Student', value: 'STUDENT' },
        { label: 'Parent', value: 'PARENT' },
        { label: 'Admin', value: 'ADMIN' },
        { label: 'Manager', value: 'MANAGER' },
      ],
      defaultValue: 'STUDENT',
    },
    {
      name: 'studentDetails',
      type: 'group',
      admin: {
        condition: (_, { role }) => role === 'STUDENT',
      },
      fields: [
        {
          name: 'course',
          type: 'text',
          required: true,
        },
        {
          name: 'batch',
          type: 'text',
        },
        {
          name: 'attendance',
          type: 'number',
        },
        {
          name: 'parentId',
          type: 'relationship',
          relationTo: 'users',
        },
      ],
    },
    {
      name: 'parentDetails',
      type: 'group',
      admin: {
        condition: (_, { role }) => role === 'PARENT',
      },
      fields: [
        {
          name: 'contactNumber',
          type: 'text',
          required: true,
        },
        {
          name: 'address',
          type: 'text',
        },
        {
          name: 'children',
          type: 'relationship',
          relationTo: 'users',
          hasMany: true,
        },
      ],
    },
    {
      name: 'adminDetails',
      type: 'group',
      admin: {
        condition: (_, { role }) => role === 'ADMIN',
      },
      fields: [
        {
          name: 'permissions',
          type: 'array',
          fields: [
            {
              name: 'module',
              type: 'text',
            },
            {
              name: 'accessLevel',
              type: 'select',
              options: [
                { label: 'Read', value: 'Read' },
                { label: 'Write', value: 'Write' },
                { label: 'Admin', value: 'Admin' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'managerDetails',
      type: 'group',
      admin: {
        condition: (_, { role }) => role === 'MANAGER',
      },
      fields: [
        {
          name: 'assignedCenters',
          type: 'array',
          fields: [
            {
              name: 'centerName',
              type: 'text',
            },
            {
              name: 'location',
              type: 'text',
            },
          ],
        },
      ],
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'createdAt',
      type: 'date',
      admin: {
        readOnly: true,
        hidden: true,
      },
      defaultValue: () => new Date(),
    },
    {
      name: 'updatedAt',
      type: 'date',
      admin: {
        readOnly: true,
        hidden: true,
      },
      defaultValue: () => new Date(),
    },
  ],
  timestamps: true,
}