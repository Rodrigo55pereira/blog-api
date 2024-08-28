import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import prisma from "../../prisma/db"

export const SECRET_KEY = "cyAVFHZc-8HS'qvUn{_&y`f4i$b2fD"

export async function signinController(request: Request, response: Response) {
  const { email, password } = request.body

  try {
    const userExist = await prisma.user.findFirst({
      where: {
        email,
      },
    })

    if (!userExist) {
      return response.json({ erro: "Credenciais inválidas" })
    }

    const isValidPassword = await bcrypt.compare(password, userExist.password)

    if (!isValidPassword) {
      return response.json({ erro: "Credenciais inválidas" })
    }

    const token = await jwt.sign(
      {
        id: userExist.id,
        name: userExist.name,
        email: userExist.email,
      },
      SECRET_KEY
    )
    return response.json({
      id: userExist.id,
      name: userExist.name,
      email: userExist.email,
      token,
    })
  } catch (error) {
    return response.json({ erro: "Algo deu errado na sua requisição" })
  }
}
