// hanlder untuk menangani input data

// import package nano id untuk generatte unique id
const { response } = require("@hapi/hapi/lib/validation");
const { nanoid } = require("nanoid");

// import notes untuk menyimpan hasil kedalam notes
const notes = require("./notes");

const addNoteHandler = (request, h) => {
  const { title, body, tags } = request.payload;

  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNotes = { id, title, tags, body, createdAt, updatedAt };

  notes.push(newNotes);

  //   mengecek apakah new notes masuk kedalam server atau tidak
  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: "sukses",
      message: "Catatan berhasil ditambahkan",
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: "fail",
    message: "Catatan gagal ditambahkan",
  });
  response.code(500);
  return response;
};

// handel untuk menampilkan catatan

const getAllNotesHandler = () => ({
  status: "succes",
  data: {
    notes,
  },
});

// handel untuk detail catatan
const getNoteByIdHandler = (request, h) => {
  // mendapatkan id catatan dari request param
  const { id } = request.params;

  // untuk memfilter id
  const note = notes.filter((n) => n.id === id)[0];

  // cek apakah note bernilai undifined atau tidak
  if (note !== undefined) {
    return {
      status: "sukses",
      data: {
        note,
      },
    };
  }

  //   apabila undifined
  const response = h.response({
    status: "fail",
    message: "catatan tidak ditemukan",
  });
  response.code(404);
  return response;
};

// handler untuk edit catatan
const editNoteByIdHandler = (request, h) => {
  // mendapatkan id dengan request params
  const { id } = request.params;

  // mendapatkan judul, isi, dam tag dengan payload
  const { title, body, tags } = request.payload;

  //   mengubah nilai updatedAt dengan tgl terbaru saat ini
  const updatedAt = new Date().toISOString();

  //   mendapatkan array sesuai dengan index id dengan findindexc
  const index = notes.findIndex((note) => note.id === id);

  //   mengecek apakah note dengan id yg d cari ditemukan index bernilai array bila tidak ditemukan index bernilai -1
  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };
    const response = h.response({
      status: "sukses",
      message: "data berhasil diperbaruhi",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "gagal",
    message: "gagal memperbaruhi catatan, id tidak ditemukan",
  });
  response.code(404);
  return response;
};

// hanlder untuk hapus catatan
const deleteNoteByIdHandler = (request, h) => {
  // mendapatkan id catatan dengan request params
  const { id } = request.params;

  // mendapatkan indez sesuai dengan id
  const index = notes.findIndex((note) => note.id === id);

  //   mengecel apakah index ada atau tidak bila tidak ada nilainya -1
  // untuk menghapus indez menggunakan splice()
  if (index !== -1) {
    notes.splice(index, 1);
    const response = h.response({
      status: "sukses",
      message: "catatan berhasil dihapus",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "gagal",
    message: "gagal hapus karena id catatan tidak ada",
  });
  response.code(404);
  return response;
};
module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};
