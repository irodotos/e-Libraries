package rest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.sql.SQLException;

import database.tables.EditBooksInLibraryTable;
import database.tables.EditLibrarianTable;
import mainClasses.Librarian;

@Path("availability")
public class BookAvailability {

    public BookAvailability() {}

    @PUT
    @Path("/")
    @Produces({MediaType.APPLICATION_JSON})
    public Response changeAvailabilityOfBook(@Context HttpServletRequest request,
                                             @QueryParam("isbn") String isbn,
                                             @QueryParam("availability") Boolean availability) throws SQLException, ClassNotFoundException {

        HttpSession session = request.getSession();
        EditLibrarianTable elt = new EditLibrarianTable();
        Librarian librarian = elt.databaseToLibrarian((String)session.getAttribute("loggedIn"));
        Integer librarianID = librarian.getLibrary_id();

        try {
            EditBooksInLibraryTable editBooksInLibraryTable = new EditBooksInLibraryTable();
            editBooksInLibraryTable.updateAvailabilityBookInLibrary(String.valueOf(librarianID), availability, isbn);
            return Response.status(Response.Status.OK).type("application/json").entity("{\"error\":\"book's availability didn't change\"}").build();
        }
        catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST).type("application/json").entity("{\"error\":\"book's availability didn't change\"}").build();
        }
    }
}