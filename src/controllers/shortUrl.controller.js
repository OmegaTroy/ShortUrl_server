import ShortUrl from "../models/shortUrl.model.js";
import mongoose from "mongoose";

// Redirigir a la URL original
export const redirectShortUrl = async (req, res) => {
  const { shortUrl } = req.params;

  try {
    // Buscar la URL corta en la base de datos
    const url = await ShortUrl.findOne({ shortUrl });

    if (!url) {
      return res.status(404).json({ message: "URL not found" });
    }

    // Incrementar el contador de clics
    url.clicks = (url.clicks || 0) + 1;
    await url.save();

    // Redirigir a la URL original
    res.redirect(302, url.url);
  } catch (error) {
    console.error("Error redirecting:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Crear una nueva short URL
export const createShortUrl = async (req, res) => {
  const { shortUrl, url } = req.body;
  const MAX_URLS_PER_USER = 15;
  
  try {
    // Verificar si el shortUrl ya existe
    const existing = await ShortUrl.findOne({ shortUrl });
    if (existing) {
      return res.status(400).json({ message: "shortUrl already exists" });
    }

    // Contar cuántas URLs tiene el usuario actual
    const userUrlCount = await ShortUrl.countDocuments({ user: req.user.id });
    
    // Verificar si ha alcanzado el límite
    if (userUrlCount >= MAX_URLS_PER_USER) {
      return res.status(400).json({ 
        message: `You have reached the maximum limit of ${MAX_URLS_PER_USER} short URLs. Please delete some to create new ones.` 
      });
    }

    const newShortUrl = new ShortUrl({
      shortUrl,
      url,
      user: req.user.id,
    });

    const saved = await newShortUrl.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Obtener todas las URLs del usuario
export const getShortUrls = async (req, res) => {
  try {
    const urls = await ShortUrl.find({ user: req.user.id });

    if (urls.length === 0) {
      return res.status(404).json({ message: "No shortUrls found" });
    }

    res.json(urls);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Server error" });
  }
};

// Obtener una sola URL por ID
export const getShortUrl = async (req, res) => {
  const { id } = req.params;
  try {
    const url = await ShortUrl.findById(id);

    if (!url) {
      return res.status(404).json({ message: "shortUrl not found" });
    }

    res.json(url);
  } catch (error) {
    console.error(error);

    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Server error" });
  }
};

// Eliminar una URL
export const deleteShortUrl = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await ShortUrl.findOneAndDelete({ _id: id });

    if (!deleted) {
      return res.status(404).json({ message: "URL not found" });
    }

    const urls = await ShortUrl.find({ user: req.user.id });
    res.json(urls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Actualizar una URL
export const updateShortUrl = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Updating URL with ID:", id);
    console.log("Request body:", req.body);

    // Verificar que el ID sea válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de URL no válido" });
    }

    const updatedUrl = await ShortUrl.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedUrl) {
      return res.status(404).json({ message: "URL no encontrada" });
    }

    console.log("URL actualizada:", updatedUrl);
    res.json(updatedUrl);
  } catch (error) {
    console.error("Error al actualizar la URL:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res
      .status(500)
      .json({ message: "Error del servidor al actualizar la URL" });
  }
};
