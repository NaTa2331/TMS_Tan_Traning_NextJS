/* eslint-disable */
"use server"

export async function setSearchTerm(formData: FormData) {
    const term = formData.get('searchTerm') as string;
    // No return statement needed
  }