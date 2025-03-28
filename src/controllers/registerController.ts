import { Request, Response } from "express"
import prisma from "../../prisma/db"
import bcrypt from "bcryptjs"

export async function registerController(request: Request, response: Response) {
  const { name, email, password } = request.body

  try {
    const userExist = await prisma.user.findFirst({
      where: {
        email,
      },
    })

    if (userExist) {
      return response.json({ erro: "Usuário já existe" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
    })
    return response.json(user)
  } catch (error) {
    return response.json({ erro: "Algo de errado com sua requisição" })
  }
}
